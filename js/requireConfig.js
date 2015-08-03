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

		/**
		 * core
		 * */
		_: 									'core/_',
		Application: 						'core/Application',
		Model: 								'core/Model',

		/**
		 * package for catalog
		 *
		 * */
		DirectoryTreeModel: 				'viewModel/DirectoryTreeModel',
		FolderTreeViewModel: 				'viewModel/FolderTreeViewModel',
		FileTreeViewModel: 					'viewModel/FileTreeViewModel',
		DragAndDropModel: 					'viewModel/mixin/DragAndDropModel',
		VirtualFileSystemModel: 			'system/VirtualFileSystemModel',
		FilesCollection: 					'collection/FilesCollection',
		ItemCatalogViewModel: 				'viewModel/mixin/ItemCatalogViewModel',
		FileModel: 							'model/FileModel',
		FolderModel: 						'model/FolderModel',
		FileViewModel: 						'viewModel/FileViewModel',

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
