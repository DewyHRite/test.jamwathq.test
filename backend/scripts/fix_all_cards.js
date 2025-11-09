const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../../frontend/agencies.html');

// Read the file
let content = fs.readFileSync(targetPath, 'utf-8');

// List of all agency IDs (excluding 10881 which we already fixed)
const agencyIds = [
    'arize', 'a1', 'access', 'adnil', 'acep', 'akey1', 'alphanso', 'atlantic',
    'atsed', 'beadles', 'cy', 'ccs', 'capecod', 'checkin', 'cuse', 'csa',
    'dgs', 'dallas', 'destin', 'dj', 'dorryus', 'ejam', 'explorework',
    'exploreyourworld', 'faithplacement', 'firstclass', 'flyerzone', 'gamma',
    'globalinsight', 'goldenluxe', 'gtg', 'hrelite', 'interexchange', 'icde',
    'irss', 'itce', 'islandplus', 'iwts', 'jd', 'jab', 'joyst', 'laconic',
    'lenclair', 'lils', 'mh', 'maxj', 'mayfos', 'mcleans', 'owt', 'patriots',
    'platinum', 'polaris', 'practical', 'progressive', 'seaview', 'seramil',
    'skills', 'steep', 'snow', 'sora', 'summerchoice', 'swat', 'tander',
    'passport', 'thelia', 'trailes', 'travelaire', 'trevorhamilton', 'workabroad'
];

let fixedCount = 0;

for (const agencyId of agencyIds) {
    // Pattern to find the problematic structure with review-buttons-container
    const pattern = new RegExp(
        `(<textarea[^>]*id="comments-${agencyId}"[^>]*>[^<]*</textarea>\\s*(?:<br />)?\\s*)` +
        `(?:<!-- Submit Button -->\\s*)?` +
        `<div class="review-buttons-container">\\s*` +
        `<button[^>]*onclick="submitReview[^"]*"[^>]*>Submit Review</button>\\s*` +
        `<button[^>]*class="view-past-reviews-btn"[^>]*onclick="togglePastReviews\\('${agencyId}'\\)"[^>]*>[^<]*</button>\\s*` +
        `</div>\\s*` +
        `</form>\\s*` +
        `</section>\\s*` +
        `</div>\\s*` +
        `<button[^>]*class="view-past-reviews-btn[^"]*"[^>]*onclick="togglePastReviews\\('${agencyId}'\\)"[^>]*>[^<]*</button>`,
        'i'
    );

    if (pattern.test(content)) {
        content = content.replace(pattern, (match) => {
            const funcName = getFunctionName(agencyId);
            return match
                .replace(/<div class="review-buttons-container">[\s\S]*?<\/div>/i, `<button type="button" onclick="submitReview${funcName}()">Submit Review</button>`)
                .replace(/<button[^>]*class="view-past-reviews-btn[^"]*"[^>]*onclick="togglePastReviews\('[^']*'\)"[^>]*>[^<]*<\/button>/i, `<button type="button" class="view-past-reviews-btn-semi" onclick="togglePastReviews('${agencyId}')">◄ View Past Reviews</button>`);
        });
        fixedCount++;
    }
}

// Helper function to get the correct function name
function getFunctionName(agencyId) {
    const functionMap = {
        'arize': 'Arize',
        'a1': 'A1',
        'access': 'Access',
        'adnil': 'Adnil',
        'acep': 'Acep',
        'akey1': 'Akey1',
        'alphanso': 'Alphanso',
        'atlantic': 'Atlantic',
        'atsed': 'Atsed',
        'beadles': 'Beadles',
        'cy': 'CY',
        'ccs': 'CCS',
        'capecod': 'CapeCod',
        'checkin': 'Checkin',
        'cuse': 'Cuse',
        'csa': 'Csa',
        'dgs': 'Dgs',
        'dallas': 'Dallas',
        'destin': 'Destin',
        'dj': 'DJ',
        'dorryus': 'Dorryus',
        'ejam': 'Ejam',
        'explorework': 'ExploreWork',
        'exploreyourworld': 'ExploreYourWorld',
        'faithplacement': 'FaithPlacement',
        'firstclass': 'FirstClass',
        'flyerzone': 'FlyerZone',
        'gamma': 'Gamma',
        'globalinsight': 'GlobalInsight',
        'goldenluxe': 'GoldenLuxe',
        'gtg': 'GTG',
        'hrelite': 'HRElite',
        'interexchange': 'InterExchange',
        'icde': 'ICDE',
        'irss': 'IRSS',
        'itce': 'ITCE',
        'islandplus': 'IslandPlus',
        'iwts': 'IWTS',
        'jd': 'JD',
        'jab': 'JAB',
        'joyst': 'JoyStaff',
        'laconic': 'Laconic',
        'lenclair': 'LenClair',
        'lils': 'Lils',
        'mh': 'MH',
        'maxj': 'MaxJ',
        'mayfos': 'Mayfos',
        'mcleans': 'McLeans',
        'owt': 'OWT',
        'patriots': 'Patriots',
        'platinum': 'Platinum',
        'polaris': 'Polaris',
        'practical': 'Practical',
        'progressive': 'Progressive',
        'seaview': 'SeaView',
        'seramil': 'Seramil',
        'skills': 'Skills',
        'steep': 'Steep',
        'snow': 'Snow',
        'sora': 'Sora',
        'summerchoice': 'SummerChoice',
        'swat': 'SWAT',
        'tander': 'Tander',
        'passport': 'Passport',
        'thelia': 'Thelia',
        'trailes': 'Trailes',
        'travelaire': 'TravelAire',
        'trevorhamilton': 'TrevorHamilton',
        'workabroad': 'WorkAbroad'
    };

    return functionMap[agencyId] || agencyId.charAt(0).toUpperCase() + agencyId.slice(1);
}

// Write back
fs.writeFileSync(targetPath, content, 'utf-8');

console.log(`Fixed ${fixedCount} agency cards`);
