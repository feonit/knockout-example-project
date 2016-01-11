require = {

	waitSeconds: 1000,

	baseUrl: './src/',

	paths: {

		/**
		 * infrastructure
		 * */
		knockout: 							'../libs/knockout',
		'knockout.mapping': 				'../libs/knockout.mapping',
		'text':								'../libs/require-text',
		'json':								'../libs/require-json',
		'mustache':							'../libs/mustache',

		/**
		 * app
		 * */
		Application: 						'app/Application',
		infrastructure: 					'app/infrastructure',
		startup:							'app/startup',

		/**
		 * core
		 * */
		_: 									'app/util',
		Model: 								'app/Model',
		View: 								'app/View',
		CommunicationSystem: 				'systems/communication/CommunicationSystem',
		configurationSystem: 				'systems/configuration/configuration',

		/**
		 * ui components (package for catalog-tree component)
		 * */
		'catalog-tree': 					'components/catalog-tree/catalog-tree',
		CatalogViewModel: 					'components/catalog-tree/CatalogViewModel',
		FolderRootViewModel: 				'components/catalog-tree/FolderRootViewModel',
		ItemModel: 							'components/catalog-tree/ItemModel',
		enterKey: 							'components/catalog-tree/bindings/enterKey',
		escKey: 							'components/catalog-tree/bindings/escKey',


		'media-player': 					'components/media-player/media-player',
		'PlayerViewModel':					'components/media-player/viewModel/PlayerViewModel',

		'fileload-zone': 					'components/fileload-zone/fileload-zone',
		'FileUploadZoneViewModel':			'components/fileload-zone/viewModel/FileUploadZoneViewModel'
	},

	shim: {
		'knockout.mapping':{
			deps: ['knockout'],
			exports: 'ko.mapping'
		}
	}
};