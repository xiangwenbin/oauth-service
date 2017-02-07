var model = {
  // We support generators.
  getAccessToken: async function (ctx,next) {
  
    console.log(arguments,this);
    await function(){
        console.log('getAccessToken',ctx);
    }();
    // next();
    return  { accessToken: '123dsd21eydgeweg2e', user: {} };
    // return 'works';
  },

  // Or, async/await (using _babel_).
  getAuthorizationCode: async function(ctx,next) {
    await function(){
        console.log('getAuthorizationCode')
    }();
    next();
    return 'works';
  },

  // Or, calling a node-style callback.
  getClient: async function(done) {
    await function(){
        console.log('getClient')
    }();
    return "works";
  },

  // Or, returning a promise.
  getUser: async function() {
    await function(){
        console.log('getUser')
    }();
    return "works";
  },
};

export default model;