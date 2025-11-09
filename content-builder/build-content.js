#!/usr/bin/env node
/**
 * JamWatHQ Content Builder
 * Converts Markdown files to HTML and updates the policy page
 * Ensures synchronization across all .md files and rendered pages
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked for security
marked.setOptions({
    headerIds: true,
    mangle: false,
    sanitize: false, // We trust our own content
    breaks: true,
    gfm: true
});

// Paths configuration
const CONTENT_DIR = path.join(__dirname, '..', 'frontend', 'content');
const OUTPUT_DIR = path.join(__dirname, '..', 'frontend');
const POLICY_HTML = path.join(OUTPUT_DIR, 'policy.html');

// Content files
const CONTENT_FILES = {
    about: path.join(CONTENT_DIR, 'about.md'),
    tos: path.join(CONTENT_DIR, 'tos.md'),
    cookies: path.join(CONTENT_DIR, 'cookies.md')
};

/**
 * Read and parse markdown file
 */
function readMarkdown(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return marked.parse(content);
    } catch (error) {
        console.error(`❌ Error reading ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Extract version and last updated from markdown
 */
function extractMetadata(mdContent) {
    const versionMatch = mdContent.match(/\*Version:\s*([^\*]+)\*/);
    const dateMatch = mdContent.match(/\*\*Last Updated:\*\*\s*(.+)/);
    
    return {
        version: versionMatch ? versionMatch[1].trim() : '1.0',
        lastUpdated: dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString()
    };
}

/**
 * Generate policy HTML page
 */
function generatePolicyPage(aboutHtml, tosHtml, cookiesHtml) {
    const tosRaw = fs.readFileSync(CONTENT_FILES.tos, 'utf8');
    const cookiesRaw = fs.readFileSync(CONTENT_FILES.cookies, 'utf8');
    
    const tosMetadata = extractMetadata(tosRaw);
    const cookiesMetadata = extractMetadata(cookiesRaw);
    const buildDate = new Date().toISOString();

    return `<!DOCTYPE HTML>
<!--
    Escape Velocity by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
    <head>
        <title>About & Policies - JamWatHQ</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta name="description" content="Learn about JamWatHQ, read our Terms of Service, and understand our Cookie Policy. Transparent information about our J-1 visa information platform." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <link rel="stylesheet" href="styles/main.css" />
        <link rel="stylesheet" href="styles/nav-fix.css" />
        <style>
            /* Policy Page Styles */
            .policy-container {
                max-width: 900px;
                margin: 0 auto;
                padding: 2em;
            }

            .policy-section {
                margin-bottom: 4em;
                background: #f9f9f9;
                padding: 2em;
                border-radius: 8px;
                border-left: 4px solid #ffee00;
            }

            .policy-section h1 {
                color: #ffee00;
                border-bottom: 2px solid #ffee00;
                padding-bottom: 0.5em;
                margin-bottom: 1em;
            }

            .policy-section h2 {
                color: #28a745;
                margin-top: 1.5em;
            }

            .policy-section h3 {
                color: #333;
                margin-top: 1.2em;
            }

            .policy-section table {
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
                overflow-x: auto;
                display: block;
            }

            .policy-section table thead {
                background: #ffee00;
            }

            .policy-section table th,
            .policy-section table td {
                padding: 0.75em;
                text-align: left;
                border: 1px solid #ddd;
            }

            .policy-section table tbody tr:nth-child(even) {
                background: #fff;
            }

            .policy-section a {
                color: #28a745;
                text-decoration: none;
                border-bottom: 1px dotted #28a745;
            }

            .policy-section a:hover {
                color: #ffee00;
                border-bottom-color: #ffee00;
            }

            .policy-section ul,
            .policy-section ol {
                margin-left: 2em;
                line-height: 1.8;
            }

            .policy-section code {
                background: #e8e8e8;
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }

            .policy-section blockquote {
                border-left: 3px solid #28a745;
                margin: 1em 0;
                padding-left: 1em;
                color: #555;
                font-style: italic;
            }

            .metadata {
                font-size: 0.85em;
                color: #777;
                margin-top: 1em;
                padding-top: 1em;
                border-top: 1px solid #ddd;
            }

            .table-of-contents {
                background: #fff;
                padding: 1.5em;
                border-radius: 8px;
                margin-bottom: 2em;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .table-of-contents h2 {
                color: #ffee00;
                margin-top: 0;
            }

            .table-of-contents ul {
                list-style: none;
                margin-left: 0;
            }

            .table-of-contents li {
                margin: 0.5em 0;
            }

            .table-of-contents a {
                color: #333;
                text-decoration: none;
                display: block;
                padding: 0.5em;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .table-of-contents a:hover {
                background: #ffee00;
                color: #000;
                padding-left: 1em;
            }

            /* Floating Gear Icon - Consistent with other pages */
            .floating-gear-icon {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: #ffee00;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(255, 238, 0, 0.3);
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s ease;
                text-decoration: none !important;
            }

            .floating-gear-icon:hover {
                background: #fff700;
                transform: scale(1.1) rotate(90deg);
                box-shadow: 0 6px 20px rgba(255, 238, 0, 0.5);
            }

            .floating-gear-icon i {
                font-size: 20px;
                color: #000000;
                transition: transform 0.3s ease;
            }

            .floating-gear-icon::before {
                content: "Report a problem";
                position: absolute;
                left: auto;
                right: calc(100% + 12px);
                top: 50%;
                transform: translateY(-50%);
                background: #333333;
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-family: "Montserrat", Arial, sans-serif;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
                pointer-events: none;
                border: 1px solid #ffee00;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .floating-gear-icon:hover::before {
                opacity: 1;
                visibility: visible;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .policy-container {
                    padding: 1em;
                }

                .policy-section {
                    padding: 1em;
                }

                .policy-section table {
                    font-size: 0.85em;
                }

                .floating-gear-icon {
                    width: 45px;
                    height: 45px;
                    bottom: 15px;
                    right: 15px;
                }

                .floating-gear-icon i {
                    font-size: 18px;
                }
            }

            /* Print styles */
            @media print {
                .floating-gear-icon,
                #nav,
                #header {
                    display: none;
                }

                .policy-section {
                    page-break-inside: avoid;
                    border: none;
                    box-shadow: none;
                }
            }
        </style>
    </head>
    <body class="no-sidebar is-preload">
        <div id="page-wrapper">

            <!-- Header -->
            <section id="header" class="wrapper" style="background-image: url('assets/images/wp4013673.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;">

                <!-- Logo -->
                <div id="logo">
                    <h1>
                        <a href="index.html" class="logo-link">
                            <span id="word1">Jamaican</span>
                            <span id="word2">Work</span>
                            <span id="word3">and</span>
                            <span id="word4">Travel</span>
                            <span id="word5">HQ</span>
                        </a>
                    </h1>
                    <p class="logo-tagline">
                        <span id="tagline1">About</span>
                        <span id="tagline2">Us</span>
                        <span id="tagline3">&</span>
                        <span id="tagline4">Our</span>
                        <span id="tagline5">Policies</span>
                    </p>
                </div>

                <!-- Nav -->
                <nav id="nav">
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="agencies.html">Agencies</a></li>
                        <li><a href="news.html">J-1 News</a></li>
                        <li>
                            <a href="https://jm.usembassy.gov/" target="_blank">Embassy Websites</a>
                            <ul>
                                <li><a href="https://ceac.state.gov/GenNIV/Default.aspx" target="_blank">DS-160 Website</a></li>
                                <li><a href="https://ais.usvisa-info.com/en-jm/niv" target="_blank">Visa Appointment Website</a></li>
                                <li><a href="https://i94.cbp.dhs.gov/home" target="_blank">I-94 Website</a></li>
                                <li><a href="https://www.fmjfee.com/i901fee/index.html?content=status/checkStatus" target="_blank">I-901 website</a></li>
                                <li><a href="https://ceac.state.gov/CEACStatTracker/Status.aspx" target="_blank">Visa Status Check</a></li>
                                <li><a href="https://j1visa.state.gov/contacts/" target="_blank">J-1 Visa Emergency Hotline!!!</a></li>
                            </ul>
                        </li>
                        <li><a href="guide.html">J-1 Guides & Tips</a></li>
                        <li><a href="faq.html">FAQs</a></li>
                        <li><a href="#">J-1 Testimonials</a></li>
                        <li><a href="share-experience.html">Share your Experience</a></li>
                        <li class="current"><a href="policy.html">About Us</a></li>
                    </ul>
                </nav>
            </section>

            <!-- Main -->
            <section id="main" class="wrapper style2">
                <div class="title">About & Policies</div>
                <div class="container">
                    <div class="policy-container">

                        <!-- Table of Contents -->
                        <div class="table-of-contents">
                            <h2>📋 Quick Navigation</h2>
                            <ul>
                                <li><a href="#about">🇯🇲 About JamWatHQ</a></li>
                                <li><a href="#terms">📜 Terms of Service</a></li>
                                <li><a href="#cookies">🍪 Cookie & Cache Policy</a></li>
                            </ul>
                            <p style="margin-top: 1em; color: #777; font-size: 0.9em;">
                                <strong>Last Updated:</strong> ToS v${tosMetadata.version} (${tosMetadata.lastUpdated}), 
                                Cookies v${cookiesMetadata.version} (${cookiesMetadata.lastUpdated})
                            </p>
                        </div>

                        <!-- About Us Section -->
                        <div class="policy-section" id="about">
                            ${aboutHtml}
                        </div>

                        <!-- Terms of Service Section -->
                        <div class="policy-section" id="terms">
                            ${tosHtml}
                        </div>

                        <!-- Cookie Policy Section -->
                        <div class="policy-section" id="cookies">
                            ${cookiesHtml}
                        </div>

                        <!-- Build Information -->
                        <div class="metadata">
                            <p>
                                <strong>Page Generated:</strong> ${new Date(buildDate).toLocaleString()}<br>
                                <strong>Build System:</strong> JamWatHQ Content Builder v1.0<br>
                                <strong>Content Sources:</strong> 
                                <a href="content/about.md">about.md</a>, 
                                <a href="content/tos.md">tos.md</a>, 
                                <a href="content/cookies.md">cookies.md</a>
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <!-- Footer -->
            <section id="footer" class="wrapper">
                <div class="title">Contact & Support</div>
                <div class="container">
                    <header class="style1">
                        <h2>Get in Touch</h2>
                        <p>Questions about our policies or the J-1 program? We're here to help.</p>
                    </header>
                    <div class="row">
                        <div class="col-12">
                            <section class="feature-list small">
                                <div class="row">
                                    <div class="col-6 col-12-small">
                                        <section>
                                            <h3 class="icon solid fa-home">Mailing Address</h3>
                                            <p>
                                                Jamaica<br />
                                                1234 Somewhere Rd<br />
                                            </p>
                                        </section>
                                    </div>
                                    <div class="col-6 col-12-small">
                                        <section>
                                            <h3 class="icon solid fa-comment">Social</h3>
                                            <p>
                                                <a href="https://www.instagram.com/jamwathq?utm_source=qr&igsh=MWgxdTlpY3NpcWx3bw==" target="_blank">instagram/JamWatHQ</a><br />
                                                <a href="https://www.facebook.com/profile.php?id=61575307395932" target="_blank">facebook.com/JamWat</a>
                                            </p>
                                        </section>
                                    </div>
                                    <div class="col-6 col-12-small">
                                        <section>
                                            <h3 class="icon solid fa-envelope">Email</h3>
                                            <p>
                                                <a href="mailto:jamwathq@outlook.com">jamwathq@outlook.com</a>
                                            </p>
                                        </section>
                                    </div>
                                    <div class="col-6 col-12-small">
                                        <section>
                                            <h3 class="icon solid fa-phone">Phone</h3>
                                            <p>
                                                (876) 555-0000
                                            </p>
                                        </section>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div id="copyright">
                        <ul>
                            <li>&copy; JamWatHQ ${new Date().getFullYear()}. All rights reserved.</li>
                        </ul>
                    </div>
                </div>
            </section>

        </div>

        <!-- Scripts -->
        <script src="scripts/jquery.min.js"></script>
        <script src="scripts/jquery.dropotron.min.js"></script>
        <script src="scripts/browser.min.js"></script>
        <script src="scripts/breakpoints.min.js"></script>
        <script src="scripts/util.js"></script>
        <script src="scripts/main.js"></script>

        <!-- Floating Gear Icon for Settings/Support -->
        <a href="#footer" class="floating-gear-icon" title="Contact & Support">
            <i class="fa fa-cog"></i>
        </a>

    </body>
</html>`;
}

/**
 * Main build function
 */
function buildContent() {
    console.log('🔨 JamWatHQ Content Builder\n');
    console.log('📂 Reading markdown files...');

    // Read all markdown files
    const aboutHtml = readMarkdown(CONTENT_FILES.about);
    const tosHtml = readMarkdown(CONTENT_FILES.tos);
    const cookiesHtml = readMarkdown(CONTENT_FILES.cookies);

    if (!aboutHtml || !tosHtml || !cookiesHtml) {
        console.error('\n❌ Build failed: Could not read all content files');
        process.exit(1);
    }

    console.log('✅ Markdown files parsed successfully');
    console.log('   - about.md (%d chars)', fs.readFileSync(CONTENT_FILES.about, 'utf8').length);
    console.log('   - tos.md (%d chars)', fs.readFileSync(CONTENT_FILES.tos, 'utf8').length);
    console.log('   - cookies.md (%d chars)', fs.readFileSync(CONTENT_FILES.cookies, 'utf8').length);

    // Generate policy page
    console.log('\n🏗️  Generating policy.html...');
    const policyPage = generatePolicyPage(aboutHtml, tosHtml, cookiesHtml);

    // Write output file
    try {
        fs.writeFileSync(POLICY_HTML, policyPage, 'utf8');
        const stats = fs.statSync(POLICY_HTML);
        console.log('✅ Policy page generated successfully');
        console.log('   - Output: policy.html (%d KB)', Math.round(stats.size / 1024));
    } catch (error) {
        console.error('❌ Error writing policy.html:', error.message);
        process.exit(1);
    }

    // Generate summary
    console.log('\n📊 Build Summary:');
    console.log('   - Content files: 3 markdown files processed');
    console.log('   - Output files: 1 HTML file generated');
    console.log('   - Build time: %dms', new Date() - startTime);
    console.log('\n✅ Build completed successfully!\n');
}

// Track build time
const startTime = new Date();

// Run build
try {
    buildContent();
} catch (error) {
    console.error('\n❌ Build error:', error);
    process.exit(1);
}
