Auth provider gets the current user and re-renders when it changes.

Private Pages mean the user must be logged in to view that page.
Private component will find the stripeRole in the user object and render the component if the user has the role applicable to the component.

Initialise Stripe loads the stripe instance.

Create checkout session creates a checkout session with the stripe api, when it is created in Firebase it redirects to stripe checkout

When stripe checkout is complete it redirects to the success page and attaches the purchased role to the user account under stripeRole

