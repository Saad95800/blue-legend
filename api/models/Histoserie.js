module.exports = {

    attributes: {
  
      score: {
        type: 'string'
      },

      completed: {
        type: 'boolean'
      },

      dataseries: {
        collection: 'dataserie',
        via: 'owner_histoserie',
        type: "string"
      },

      owner_serie: {
        model: 'serie'
      },

      owner_user: {
        model: 'user'
      }
  
    },
  
  
  };
  