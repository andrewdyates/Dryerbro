// The app is running in the browser
if(!Ti){
  var fakeTi = true;
  var Ti = {
    API: {
      debug: function(msg){
        console.debug(msg);
      }
    },
    App: {
      addEventListener: function(name, func){
        $(document).bind(name, func);
      },
      fireEvent: function(name, data){
        $(document).trigger(name, [data]);
      }
    }
  };
}