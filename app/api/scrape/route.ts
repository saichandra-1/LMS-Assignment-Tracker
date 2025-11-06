import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

// Helper function to replace deprecated waitForTimeout
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get Chromium executable path (works for both local and Vercel)
async function getBrowser() {
    const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    if (isVercel) {
        // Use Chromium for Vercel - properly configured for serverless
        const chromium = await import('@sparticuz/chromium');
        const Chromium = chromium.default || chromium;
        
        // Get Chromium executable path and args (already configured for serverless)
        const executablePath = await Chromium.executablePath();
        const args = Chromium.args || [];
        
        return puppeteer.launch({
            args: [
                ...args,
                '--hide-scrollbars',
                '--disable-web-security',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-extensions',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--disable-backgrounding-occluded-windows',
                '--disable-breakpad',
                '--disable-component-extensions-with-background-pages',
                '--disable-default-apps',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--disable-sync',
                '--disable-background-downloads',
                '--disable-client-side-phishing-detection',
                '--disable-hang-monitor',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-translate',
                '--metrics-recording-only',
                '--no-crash-upload',
                '--no-default-browser-check',
                '--no-pings',
                '--password-store=basic',
                '--use-mock-keychain'
            ],
            defaultViewport: Chromium.defaultViewport || { width: 1280, height: 720 },
            executablePath: executablePath,
            headless: Chromium.headless,
        });
    } else {
        // Local development - use system Chrome
        const puppeteerFull = await import('puppeteer');
        return puppeteerFull.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Launch browser
        const browser = await getBrowser();

        try {
            const page = await browser.newPage();
            
            // Navigate to login
            await page.goto('https://lms.vit.ac.in/login/index.php', {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            await page.waitForSelector('#username', { timeout: 10000 });
            
            // Enter credentials
            await page.type('#username', username, { delay: 50 });
            await page.type('#password', password, { delay: 50 });
            
            // Login
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => delay(3000)),
                page.click('#loginbtn')
            ]);

            await delay(2000);

            // Navigate to calendar
            const currentUrl = page.url();
            if (!currentUrl.includes('calendar')) {
                await page.goto('https://lms.vit.ac.in/calendar/view.php?view=month', {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });
                await delay(2000);
            }

            // Extract assignments
            const assignments = await page.evaluate(() => {
                const results: any[] = [];
                const foundAssignments = new Map();

                const assignmentEvents = document.querySelectorAll('li[data-event-component="mod_assign"]');
                
                assignmentEvents.forEach((event) => {
                    try {
                        const nameElement = event.querySelector('span.eventname');
                        if (!nameElement) return;
                        
                        const assignmentName = nameElement.textContent?.trim() || '';
                        const linkElement = event.querySelector('a[href*="mod/assign/view.php"]') as HTMLAnchorElement;
                        const url = linkElement?.href || null;
                        const assignmentId = url ? url.match(/id=(\d+)/)?.[1] : null;
                        const eventId = (event.querySelector('a[data-action="view-event"]') as HTMLElement)?.getAttribute('data-event-id') || null;
                        const eventType = event.getAttribute('data-event-eventtype') || 'unknown';
                        
                        let dayCell = event.closest('td.day') as HTMLElement;
                        if (!dayCell) {
                            let parent = event.parentElement;
                            while (parent && !parent.classList.contains('day')) {
                                parent = parent.parentElement;
                            }
                            dayCell = parent as HTMLElement;
                        }
                        
                        let dateInfo = null;
                        if (dayCell) {
                            const timestamp = dayCell.getAttribute('data-day-timestamp');
                            if (timestamp) {
                                const date = new Date(parseInt(timestamp) * 1000);
                                dateInfo = {
                                    formatted: date.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }),
                                    timestamp: parseInt(timestamp),
                                    raw: date.toISOString().split('T')[0]
                                };
                            }
                        }
                        
                        const uniqueKey = `${assignmentName}_${dateInfo ? dateInfo.raw : 'no-date'}`;
                        
                        if (!foundAssignments.has(uniqueKey)) {
                            foundAssignments.set(uniqueKey, true);
                            
                            results.push({
                                name: assignmentName,
                                date: dateInfo ? dateInfo.formatted : 'Date not found',
                                timestamp: dateInfo ? dateInfo.timestamp : null,
                                rawDate: dateInfo ? dateInfo.raw : null,
                                assignmentId: assignmentId,
                                eventId: eventId,
                                url: url,
                                eventType: eventType,
                                course: null
                            });
                        }
                    } catch (error) {
                        console.error('Error processing assignment:', error);
                    }
                });

                return results;
            });

            // Get course information (limit to first 3 for Vercel memory/timeout)
            const limit = process.env.VERCEL ? 3 : assignments.length;
            for (let i = 0; i < Math.min(limit, assignments.length); i++) {
                const assignment = assignments[i];
                try {
                    let assignmentLink = null;
                    
                    if (assignment.eventId) {
                        assignmentLink = await page.$(`a[data-event-id="${assignment.eventId}"]`).catch(() => null);
                    }
                    
                    if (!assignmentLink && assignment.assignmentId) {
                        assignmentLink = await page.$(`a[href*="mod/assign/view.php?id=${assignment.assignmentId}"]`).catch(() => null);
                    }
                    
                    if (assignmentLink) {
                        await assignmentLink.evaluate((el: any) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
                        await delay(500);
                        
                        await assignmentLink.click({ delay: 100 });
                        await delay(1500);
                        
                        const courseName = await page.evaluate(() => {
                            const gradCap = document.querySelector('i.fa-graduation-cap, i[title="Course"], i[aria-label="Course"]');
                            if (gradCap) {
                                const row = gradCap.closest('.row');
                                if (row) {
                                    const courseLink = row.querySelector('a[href*="course/view.php"]');
                                    if (courseLink) {
                                        return courseLink.textContent?.trim() || null;
                                    }
                                }
                            }
                            return null;
                        }).catch(() => null);
                        
                        if (courseName) {
                            assignment.course = courseName;
                        }
                        
                        const closeBtn = await page.$('button[data-action="hide"], .close, button[aria-label="Close"]').catch(() => null);
                        if (closeBtn) {
                            await closeBtn.click();
                        } else {
                            await page.keyboard.press('Escape');
                        }
                        await delay(500);
                    }
                } catch (error) {
                    // Continue if course extraction fails
                }
            }

            await browser.close();

            return NextResponse.json({
                success: true,
                assignments: assignments,
                count: assignments.length
            });

        } catch (error: any) {
            await browser.close();
            throw error;
        }

    } catch (error: any) {
        console.error('Scraping error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to scrape assignments' },
            { status: 500 }
        );
    }
}
