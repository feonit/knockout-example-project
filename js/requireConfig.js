/**
 * @author Orlov Leonid, feonitu@yandex.ru
 * */

require.config({

	waitSeconds: 1000,

	paths: {

		/**
		 * infrastructure
		 * */
		knockout: '../lib/knockout',
		jquery: '../lib/jquery',
		'knockout.mapping': '../lib/knockout.mapping',
		/**
		 * core
		 * */
		_: '../js/core/_',
		Model: 						'core/Model',

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
		FileViewModel: 						'viewModel/FileViewModel',

	},

	shim: {
		'knockout.mapping':{
			deps: ['knockout'],
			exports: 'ko.mapping'
		}
	}
});


require(['infrastructure'], function(){

	require(['knockout', 'jquery', 'VirtualFileSystemModel'], function(ko, $, VirtualFileSystemModel){

		$(function(){

			window.ROOT = ko.observable({
				virtualFileSystemModel : ko.observable(new VirtualFileSystemModel())
			});

			window.ROOT().virtualFileSystemModel().directoryTreeModel().fetch();
			window.ROOT().virtualFileSystemModel().directoryTreeModel().rootFolder().open();


			ko.applyBindings(window.ROOT);

		});

	});

});
