const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended : true}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
    
    const {firstName, lastName, email} = req.body;

    // Validation
    if(!firstName || !lastName || !email)
    {
        res.redirect('/fail.html');
        return;
    }

    // Construct request data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    
    console.log(data);

    const postData = JSON.stringify(data);

    const options = {
        url: 'https://us7.api.mailchimp.com/3.0/lists/c3aef520f0',
        medthod: 'POST',
        headers: {
            Authorization: 'auth 0cff954b3801a5370ff14721e036ecf4-us7'
        },
        body: postData
    }

    request(options, (err, response, body) => {
        if(err) {
            res.redirect('/fail.html');
        } else {
            if(response.statusCode === 200)
            {
                let json = JSON.parse(body);
                console.log(json);
                res.redirect('/success.html');
            }
            else {
                res.redirect('/fail.html');
            }
        } 
    });
});

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on port ${port}`))