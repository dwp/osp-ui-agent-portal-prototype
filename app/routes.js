//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//
const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();
const Nino = require('./utils/nino');
const issues = require('./data/payments');

const {
    formatShortDate,
    formatLongDate
} = require('./utils/date-formatters');

const userRoleMapping = {
    "CIS-901": { text: "Claims and Changes Agent" },
    "CIS-902": { text: "View Only" },
    "CIS-903": { text: "SCR agent" }
};

const userGradeMapping = {
    "CIS-911": { text: "EO and above" },
    "CIS-???": { text: "Other" },
};

// Middle wear for currentUrl
router.use((req, res, next) => {
  res.locals.pageContext = { currentUrl: req.path };
  next();
});


// Add your routes here
router.get('/developer-login', (req, res) => {
    req.session.data.userData = {};

    return res.render('/developer-login');
});

router.post('/developer-login', (req, res) => {
    const { userName } = req.session.data;
    const loginErrors = [];

    if (!userName?.trim()) { 
        loginErrors.push({
            text: "Enter your user name",
            href: "#userName"
        });
    }

    if (loginErrors.length) {
        return res.render('/developer-login', { 
            loginErrors 
        });
    }

    // user data displayed in the footer
    req.session.data.userData.userName = userName;
    req.session.data.userData.userRole = userRoleMapping[req.session.data.userRole]?.text;
    req.session.data.userData.userGrade = userGradeMapping[req.session.data.userGrade]?.text;
    req.session.data.userData.officeLocation = req.session.data.officeLocation;
    return res.redirect('/find-a-claim')
});

router.post('/find-a-claim', (req, res) => {
    const { nino } = req.session.data
    const findAClaimErrors = [];
    
    if (!nino?.trim()) {
        findAClaimErrors.push({
            text: "Enter a National Insurance number",
            href: "#nino"
        });
    }

    if (findAClaimErrors?.length === 0 && !Nino.isValidNino(nino)) {
        findAClaimErrors.push({
            text: "NI Number must be in acceptable format",
            href: "#nino"
        });
    }

    if (findAClaimErrors.length) {
        return res.render('/find-a-claim', {
            findAClaimErrors
        });
    }

    req.session.data.nino = '';
    return res.redirect('/account-summary');
});

router.get('/payment-summary', function (req, res) {

    const itemsPerPage = 10;

    const currentPage = parseInt(req.query.page) || 1;

    const totalIssues = issues.length;

    const totalPages = Math.ceil(totalIssues / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    const paginatedIssues = issues
    .slice(startIndex, endIndex)
    .map(function (issue) {
        return {
            ...issue,
            from: formatShortDate(issue.from),
            to: formatShortDate(issue.to),
            dateIssued: formatShortDate(issue.dateIssued)
        }
    });

    res.render('payment-summary', {
        issues: paginatedIssues,
        totalIssues: totalIssues,
        currentPage: currentPage,
        totalPages: totalPages
    });
});

router.get('/payment-details/:issueNumber', function (req, res) {

    const issue = issues.find(function (issue) {
        return issue.issueNumber === req.params.issueNumber
    });

    if (!issue) {
        return res.status(404).send('Issue not found');
    }

    res.render('payment-details', {
        issue: {
            ...issue,
            formattedFrom: formatLongDate(issue.from),
            formattedTo: formatLongDate(issue.to),
            formattedDateIssued:  formatLongDate(issue.dateIssued)
        }
    });
});

module.exports = router;