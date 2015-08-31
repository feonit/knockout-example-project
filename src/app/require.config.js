/**
 * @author Orlov Leonid, feonitu@yandex.ru
 * */

require = {

	waitSeconds: 1000,

	baseUrl: './src/',

	paths: {

		/**
		 * infrastructure
		 * */
		knockout: 							'../libs/knockout',
		jquery: 							'../libs/jquery',
		'knockout.mapping': 				'../libs/knockout.mapping',
		'text':								'../libs/require-text',
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
		_: 									'core/util',
		Model: 								'core/Model',
		View: 								'core/View',
		CommunicationSystem: 				'systems/communication/CommunicationSystem',
		configurationSystem: 				'systems/configuration/configuration',
		templatingSystem:					'systems/templating/templatingSystem',

		/**
		 * ui components (package for catalog-tree component)
		 * */
		'catalog-tree': 					'components/catalog-tree/catalog-tree',
		CatalogViewModel: 					'components/catalog-tree/viewModel/CatalogViewModel',
		FolderViewModel: 					'components/catalog-tree/viewModel/FolderViewModel',
		FileViewModel: 						'components/catalog-tree/viewModel/FileViewModel',
		DragAndDropModel: 					'components/catalog-tree/viewModel/mixin/DragAndDropModel',
		FilesCollection: 					'components/catalog-tree/collection/FilesCollection',
		ItemCatalogViewModel: 				'components/catalog-tree/viewModel/mixin/ItemCatalogViewModel',
		FileModel: 							'components/catalog-tree/models/FileModel',
		FolderModel: 						'components/catalog-tree/models/FolderModel',
		enterKey: 							'components/catalog-tree/bindings/enterKey',
		escKey: 							'components/catalog-tree/bindings/escKey'
	},

	shim: {
		'knockout.mapping':{
			deps: ['knockout'],
			exports: 'ko.mapping'
		}
	}
};