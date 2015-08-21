/**
 * @author Orlov Leonid, feonitu@yandex.ru
 * */

require.config({

	waitSeconds: 1000,

	paths: {

		/**
		 * infrastructure
		 * */
		knockout: 							'../lib/knockout',
		jquery: 							'../lib/jquery',
		'knockout.mapping': 				'../lib/knockout.mapping',
		'text':						'../lib/require-text',
		'mustache':							'../lib/mustache',

		/**
		 * core
		 * */
		_: 									'core/_',
		Application: 						'core/Application',
		Model: 								'core/Model',
		View: 								'core/View',
		infrastructure: 					'core/infrastructure',
		configurationSystem: 				'systems/configuration/configuration',
		CommunicationSystem: 				'systems/communication/CommunicationSystem',
		templateSystem:						'systems/engine/templateSystem',
		/**
		 * package for catalog
		 *
		 * */
		CatalogViewModel: 					'apps/catalog/viewModel/CatalogViewModel',
		FolderViewModel: 					'apps/catalog/viewModel/FolderViewModel',
		FileViewModel: 						'apps/catalog/viewModel/FileViewModel',
		DragAndDropModel: 					'apps/catalog/viewModel/mixin/DragAndDropModel',
		FilesCollection: 					'apps/catalog/collection/FilesCollection',
		ItemCatalogViewModel: 				'apps/catalog/viewModel/mixin/ItemCatalogViewModel',
		FileModel: 							'apps/catalog/models/FileModel',
		FolderModel: 						'apps/catalog/models/FolderModel',

		CatalogComponent: 					'apps/catalog/CatalogComponent',

	},

	shim: {
		'knockout.mapping':{
			deps: ['knockout'],
			exports: 'ko.mapping'
		}
	}
});


require(['Application'], function(Application){

	/**
	 * @global
	 */
	var app = window.app = new Application();

	app.start();
});
