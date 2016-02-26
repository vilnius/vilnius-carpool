Router.map(function() {
	da(['wru'], "Init Wru controller");
	this.route('Wru', {path: '/wru',	controller: 'WruController', template: 'Wru', 
		before: function() {
			da(['wru'], "Wru controller");
		}
	}); 
});