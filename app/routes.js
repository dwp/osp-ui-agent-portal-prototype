//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const Nino = require('./utils/nino');

const userRoleMapping = {
    "CIS-901": { text: "Claims and Changes Agent" },
    "CIS-902": { text: "View Only" },
    "CIS-903": { text: "SCR agent" }
}

const userGradeMapping = {
    "CIS-911": { text: "EO and above" },
    "CIS-???": { text: "Other" },
}

// Add your routes here
router.get('/developer-login', (req, res) => {
    req.session.data.userData = {};

    return res.render('/developer-login')
});

router.post('/developer-login', (req, res) => {
    const { userName } = req.session.data;
    const loginErrors = [];

    if (!userName?.trim()) { 
        loginErrors.push({
            text: "Enter your user name",
            href: "#userName"
        })
    }

    if (loginErrors.length) {
        return res.render('/developer-login', { 
            loginErrors 
        })
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
        })
    }

    if (findAClaimErrors?.length === 0 && !Nino.isValidNino(nino)) {
        findAClaimErrors.push({
            text: "NI Number must be in acceptable format",
            href: "#nino"
        })
    }

    if (findAClaimErrors.length) {
        return res.render('/find-a-claim', {
            findAClaimErrors
        })
    }

    req.session.data.nino = '';
    return res.redirect('/account-summary');
});