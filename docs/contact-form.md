# Contact form setup

The About page uses Web3Forms, matching the contact form in the local scottmag-com project. The footer links directly to the form. No recipient email is included in the page HTML.

1. Open https://web3forms.com/#start and request a free access key using the email address where Mary Jane wants to receive inquiries.
2. Open the message sent to that inbox and copy the access key.
3. In site-settings.yaml, paste it between the quotes after web3formsAccessKey. This is a public form access key designed to appear in the website; it is not an email password. Use a new key for this site, not Scott’s existing key.
4. Rebuild and publish through the normal workflow when ready. No Netlify Forms switch, server function, or email password is required.
5. Submit one real test inquiry on the published site, check the receiving inbox and spam folder, and verify that Reply addresses the visitor’s email.

Until a key is configured, the local form is visible with sending disabled. JavaScript is required. Successful submissions show an inline confirmation; failures retain the typed message. A hidden botcheck field provides the same basic spam protection as the reference site.

If domain restrictions are enabled in Web3Forms, allow the Netlify hostname and later the custom domain. Do not restrict to the future custom domain before it is connected.

Delivery has not been tested while the key is empty. Nothing has been deployed as part of this change.

Official setup documentation: https://docs.web3forms.com/getting-started/installation
