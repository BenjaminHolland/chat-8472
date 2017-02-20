import * as React from 'react';

import {
    Socket
}
from './Socket';

export class GoogleButton extends React.Component {
    constructor(props) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.initPromise = null;
        this.completePromise = null;
        this.state = {

            'numbers': []
        };
        console.log("Making Google Button.");


    }
    componentWillMount() {
        console.log("Will Mount");





    }
    componentDidMount() {
        console.log("Did Mount");

        //Not sure why, but logging out via refresh doesn't clear the id for the content component. 
        //this.props.onIdUpdate(0) should fix this, but is probably the wrong way to do this.

        //RESOLUTION: The issue was caused by the gapi.signin2.render function being
        //called before the auth2 signout was complete. Most of the gapi functions
        //appear to be asynchronous. 

        //Note that it seems to be strange to call gapi here where theres' no other
                    
        //There's got to be a better way of doing this than nesting asyc operations...
        
        var gstuff=gapi.load('auth2', () => {
            gapi.auth2.init({
                'clientId': '189610091735-mjde37ejomd603ihr2fiao8s40f4578e',
                'fetch_basic_profile': true,
            }).then(() => {
                
                //Sign out every time this component is mounted. This occures after construction. 
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(() => {
                    this.props.onIdUpdate(0);

                    //Use the google API to render the button with the proper callback, 
                    //rather than relying on Reacts weird render that doesn't like callbacks.
                    //indication that gapi is accessible. Not sure how to fix this yet.
                    //Found this solution on SO.
                    
                    gapi.signin2.render('g-signin2', {
                        'scope': 'https://www.googleapis.com/auth/plus.login',
                        'width': 'auto',
                        'height': 50,
                        'longtitle': true,
                        'theme': 'dark',
                        'onsuccess': this.onLogin
                    })
                })
            })
        });
        console.log(JSON.stringify(gstuff, null, 4))







    }

    onLogin(user) {
        console.log(user);
        console.log(this);
        this.props.onIdUpdate(user.getAuthResponse().id_token);
    }

    simpleCallback(user) {
        console.log("Called");
    }

    render() {

        return (
                <div id='g-signin2'/>
            )
            //<div className="g-signin2" data-onsuccess={this.simpleCallback}></div>



    }
}
