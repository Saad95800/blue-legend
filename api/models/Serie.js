module.exports = {

    attributes: {
  
      name: {
        type: 'string'
      },

      recordexpression: {
        collection: 'recordexpression',
        via: 'owner_serie',
        type: "string"
      },

      histoserie: {
        collection: 'histoserie',
        via: 'owner_serie',
        type: "string"
      },

      dataserie: {
        collection: 'dataserie',
        via: 'owner_serie',
        type: "string"
      },

      owner_text: {
        model: 'text'
      },

      owner_user: {
        model: 'user'
      }
  
    },
  
  
  };
  