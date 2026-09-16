//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
router.post('/developer-login', (req, res) => {
    const userName = req.body.userName;
    const loginErrors = [];
    
    if (!userName?.trim()) { 
        loginErrors.push({
            text: "Enter your user name",
            href: "#"
        })
        return res.render('/developer-login', { 
            loginErrors 
        })
    } else {
        req.session.loginErrors = [];
        return res.redirect('/find-a-claim')
    } 
});

router.post('/find-a-claim', (req, res) => {
    const userName = req.body.userName;
    
    if (!userName?.trim()) { 
        loginErrors.push({
            text: "Enter your user name",
            href: "#"
        })
        return res.render('/developer-login', { 
            // can we use shorthand here of just {errors}
            loginErrors: loginErrors 
        })
    } else {
        return res.redirect('/account-summary')
    } 
});