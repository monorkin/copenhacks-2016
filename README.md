Messenger Privacy Guard
=======================

Enable end-to-end encryption on [Messenger.com](https://messenger.com) using GPG.

This project is the result of Team Floki's 24 hour hackaton attendance at [Copenhacks](http://copenhacks.com/). As such, the project is currently just a *Proof of Concept*. Encrypted conversations work and data is encrypted and decrypted on the fly. However, there are no guarantees regarding the security and validity of the solution. Please remember to be careful when dealing with sensitive data.

Installation guide
------------------

This userscript currently isn't self contained - in order to communicate with your local GPG keychain, a GPG API server is needed, as well as some local set-up.

### Requirements

To use this project, you need to have a recent version of GPG, NodeJS and NPM installed.

Your browser needs to be able to load userscripts. We've tested with Greasemonkey and Tampermonkey on Firefox and Chrome.

### Cloning the project

```sh
cd mpg;
npm install;
```

### Starting the HTTPS proxy

Due to Facebook's [Content Security Policy](https://en.wikipedia.org/wiki/Content_Security_Policy), scripts running on Messenger.com can only send AJAX requests to certain whitelisted domains and all communication must be done over HTTPS. In order to get around this, we currently use a simple HTTPS proxy.

To set everything up, you need to do the following:

#### 1. Edit your hosts file so that [pgp.messenger.com](pgp.messenger.com) points to 127.0.0.1

This is neccessary to get around the CSP restriction, as domains \*.messenger.com are allowed.

To do this, open `/etc/hosts` (on OSX and Linux) and add the following line:

`127.0.0.1 pgp.messenger.com`

#### 2. Start the HTTPS proxy server

```sh
cd mpg;
node https_proxy.js;
```

#### 3. Accept or import the proxy SSL certificate

If you now open [https://pgp.messenger.com](https://pgp.messenger.com) in your browser, you should get a security error saying that the certificate is not trusted. On Firefox, you should be able to permanently add an exception for this domain. For this to work in Chrome, you need to import the page's SSL certificate.

#### 4. Start the GPG API server

In order for the userscript to communicate with your local GPG keychain, we've built a simple API server which provides encryption and decryption functionalities. You can start it with:

```sh
cd mpg;
node app.js;
```

#### 5. Add the userscript to your browser

The easiest way to do this is to use [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for Firefox or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) for Chrome.

After installing the appropriate extension, import the file [messenger.js](messenger.js) as a new userscript.

#### 6. Open Messenger.com and communicate!

After having everything set up correctly, you should now be able to open Messenger.com and exchange encrypted messages. Remember - in order to secure your communications, both parties need to have each other's keys, locally signed and trusted.

License
-------
