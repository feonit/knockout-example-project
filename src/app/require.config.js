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
		EditTitleFormModel: 				'components/catalog-tree/viewModel/mixin/EditTitleFormModel',
		CatalogModel: 						'components/catalog-tree/models/CatalogModel',
		FileModel: 							'components/catalog-tree/models/FileModel',
		FolderModel: 						'components/catalog-tree/models/FolderModel',
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