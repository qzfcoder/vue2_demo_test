//  const Yozo = {
    var yozoExt = {}
    function createNew (parentNode, wrapIframe){
         if (!parentNode) {
             throw Error('缺少parentNode参数, 必须提供该参数作为YOZO插件的父节点')
         }

         if (wrapIframe) {
             parentNode.innerHTML = `<iframe style="width: 100%;height:100%;margin: 0 !important;padding: 0 !important;border: 0 !important;"></iframe>`;
             const iframe = parentNode.firstElementChild;

            iframe.contentDocument.write(
                 `<body style="margin: 0 !important;"> <div id="__inner_yozo__"></div> </body>`
            );

             parentNode = iframe.contentWindow.document.getElementById('__inner_yozo__')
         } else {
             parentNode.innerHTML = ''
        }

        const _yozo = document.createElement('embed');
        _yozo.setAttribute('type', 'application/x-yozo-plugin');
        _yozo.setAttribute('height', '100%');
        _yozo.setAttribute('width', '100%');

         parentNode.appendChild(_yozo);

        _yozo.YozoApplication = function () {
             return _yozo.Application
         };

        // var yozoExt = {};

         yozoExt.innerYozo = _yozo;

        yozoExt.apis = {};
        yozoExt.enums = enums;

        //======= TODO 删除日志
        if (window) {
            window.readYozoLog = (param) => {
                return _yozo.YozoApplication().readlog(param)
             }
            window.readTimeConsumerRecord = (param) => {
                return _yozo.YozoApplication().readTimeConsumerRecord(param)
             }
         }
        // =======

        yozoExt.hidePlugin = () => {
            _yozo.style.visibility = 'hidden'
         };

        yozoExt.showPlugin = () => {
             _yozo.style.visibility = 'visible'
        };

		var yozoObj; //永中从插件对象
		var yozoApp; //永中接口Application对象

		/**
		 *插件初始化
		 *插件type类型，对应不用的应用
		 *application/x-yozo-plugin	    WordProcess	
		 *application/x-yozoss-plugin	SpreadSheets	
		 *application/x-yozopg-plugin	PowerPoint	
		 */
         yozoExt.apis.initYozo = function(tagID,width,height){
			var iframe;
			iframe = document.getElementById(tagID);
			var codes=[];   
			codes.push("<embed id='yozoNP_id' type='application/x-yozo-plugin'  width='"+ width +"' height='"+ height +"'>" +
					  "<param name='BorderStyle' value='91' />" +
					  "<param name='MousePointer' value='90' />" +
					  "<param name='Enabled' value='91' />" +
					  "<param name='Min' value='90' />" +
					  "<param name='Max' value='910' />" +
					  "</embed >");
			iframe.innerHTML = codes.join("");
			yozoObj = document.getElementById("yozoNP_id");
			
			yozoApp = yozoObj.Application;
            if(!yozoApp){
                return 'gg'
            }
		}


        /**
         * 获取YOZO插件的版本号
         */
        yozoExt.apis.getYOZOVersion = function () {
            return yozoApp.Version;
        }

        yozoExt.apis.getApplication = function() {
            return yozoApp;
        }

        yozoExt.apis.getPageCount = function(params) {
            const doc = getDoc(params);
            return doc.ActiveWindow.ActivePane.Pages.Count;
        }

		/**
		 * 字符串替换
		 * @param  {string} substr 要替换的字符串
		 * @param  {string} newstr 用于替换的字符串
		 * @return {string}        替换后的新字符串
		 */
		String.prototype.replaceAll = function(substr, newstr) {
		  substr = substr.replace(/[.\\[\]{}()|^$?*+]/g, "\\$&"); // 转义字符串中的元字符
		  var re = new RegExp(substr, "g"); // 生成正则
		  return this.replace(re, newstr);
		}	

        yozoExt.apis.getFilePath = function(params) {
            const doc = getDoc(params);
            var filePath = doc.Path + "\\" + doc.Name; //全部替换
            return filePath.replaceAll("\\","/");
        }
		
        yozoExt.apis.fitWindowSize = function() {
            yozoApp.ActiveWindow.ActivePane.View.Zoom.PageFit = 2;
        }

		yozoExt.apis.toggleShowRevision = function(params = { show: true }) {
            const doc = getDoc(params);
            doc.ActiveWindow.View.ShowRevisionsAndComments = params.show;
        }

        /**
         * params = {
         *     filePath, // 要复制的内容所在文档的路径
         * }
         */
        yozoExt.apis.copyFrom = function(params) {
            const doc = getDoc(params);
            const selection = yozoApp.Selection
            console.log(`要插入源文件路径: ${params.filePath}`);
            try {
                selection.InsertFile(params.filePath);
            } catch (e) {
                console.log(e);
                throw Error(`插入文档内容失败，请确认源文件是否存在: ${params.filePath}`);
            }
        }

        // ========== 书签相关函数

        /**
         * params = {
         *     bookmarkValue, // 书签上显示的文本
         * }
         *
         * 无返回值
         *
         * 如果要添加的bookmarkName已存在, 则抛出异常
         */
        yozoExt.apis.setBookmarkValue = function(params = {}) {
            const doc = getDoc(params);
            const bookmarkName = params.bookmarkName;
            const bookmarkValue = params.bookmarkValue;
            const bookmarks = doc.Bookmarks;

            if (bookmarks.Exists(bookmarkName)) {
                const bookmark = bookmarks.Item(bookmarkName);
                const range = bookmark.Range;

                bookmark.Delete();
                range.Select();
                range.Text = bookmarkValue;

                bookmarks.Add(bookmarkName, range);
            } else {
                throw Error(`书签[${bookmarkName}]不存在`);
            }
        }

        /**
         * params = {
         *     bookmarkName, // 根据书签名删除书签
         *     keepText, // 是否保留书签上的文字，默认true
         * }
         *
         * 无返回值
         *
         * 如果书签不存在，则抛出异常
         */
        yozoExt.apis.deleteBookmark = function(params = {keepText: true}) {
            const doc = getDoc(params);
            const bookmarks = doc.Bookmarks;
            const bookmarkIndex = params.bookmarkIndex;
            const bookmarkName = params.bookmarkName;

            let item = null;
            if (bookmarkIndex) {
                if (bookmarkIndex > bookmarks.Count) {
                    throw Error(
                        `书签索引溢出, 书签数量: ${
                            bookmarks.Count
                        }, 下标参数: ${bookmarkIndex}`
                    );
                }

                item = bookmarks.Item(bookmarkIndex);
            } else if (bookmarkName) {
                item = bookmarks.Item(bookmarkName);
            }

            if (item) {
                item.Range.Select();

                if (!params.keepText) item.Range.Text = '';

                item.Delete();
            } else {
                throw Error('书签不存在');
            }
        }

        /**
         * params = {
         *     bookmarkName // 根据书签名定位
         * }
         *
         * 无返回值
         *
         * 如果书签不存在，则抛出异常
         */
        yozoExt.apis.goToBookmark = function(params = {}) {
            const doc = getDoc(params);
            const bookmarks = doc.Bookmarks;
            const bookmarkIndex = params.bookmarkIndex;
            const bookmarkName = params.bookmarkName;

            let item = null;
            if (bookmarkIndex) {
                if (bookmarkIndex > bookmarks.Count) {
                    throw Error(
                        `书签索引溢出, 书签数量: ${
                            bookmarks.Count
                        }, 下标参数: ${bookmarkIndex}`
                    );
                }

                item = bookmarks.Item(bookmarkIndex);
            } else if (bookmarkName) {
                item = bookmarks.Item(bookmarkName);
            }

            if (item) {
                item.Select();
            } else {
                throw Error('书签不存在');
            }
        }

        /**
         * params = {
         * }
         *
         * 无返回值
         */
        yozoExt.apis.showBookmarks = function(params = {}) {
            const doc = getDoc(params);
            doc.ActiveWindow.View.ShowBookmarks = params.show;
        }

        /**
         * params = {
         * }
         *
         * 无返回值
         *
         * 如果要设置的bookmarkName已存在则抛出异常
         */
        yozoExt.apis.setSelectedTextAsBookmark = function(params = {}) {
            const doc = getDoc(params);
            const bookmarkName = params.bookmarkName;
            const bookmarks = doc.Bookmarks;

            if (bookmarks.Exists(bookmarkName)) {
                throw Error(`书签 ${bookmarkName} 已存在`);
            } else {
                const range = doc.ActiveWindow.Selection.Range;

                range.Select();
                bookmarks.Add(bookmarkName, range);
            }
        }

        /**
         * params = {
         * }
         *
         * 返回值 = {
         *     text, // 书签的文本值
         * }
         *
         * 如果书签不存在则抛出异常
         */
        yozoExt.apis.getBookmarkText = function(params = {}) {
            const doc = getDoc(params);
            const bookmarkName = params.bookmarkName;
            const bookmarks = doc.Bookmarks;

            if (bookmarks.Exists(bookmarkName)) {
                return {text: bookmarks.Item(bookmarkName).Range.Text};
            } else {
                throw Error(`书签[${bookmarkName}]不存在`);
            }
        }

        /**
         * params = {
         *
         * 返回值 = {
         *     count, // 书签数量
         * }
         */
        yozoExt.apis.getBookmarkCount = function(params = {}) {
            const doc = getDoc(params);
            const bookmarks = doc.Bookmarks;

            return {count: bookmarks.Count};
        }

        /**
         * params = {
         * }
         *
         * 返回值 = {
         *     exists, // true代表存在, false代表不存在
         * }
         */
        yozoExt.apis.bookmarkExists = function(params = {}) {
            const doc = getDoc(params);
            const bookmarkName = params.bookmarkName;
            const bookmarks = doc.Bookmarks;

            return {exists: bookmarks.Exists(bookmarkName)};
        }

        /**
         * params = {
         * }
         *
         * 返回值 = [书签列表]
         */
        yozoExt.apis.getBookmarkList = function(params = {}) {
            const doc = getDoc(params);

            const bookmarkList = [];
            const bookmarks = doc.Bookmarks;

            const count = bookmarks.Count;
            if (count <= 0) {
                return bookmarkList;
            }

            for (let i = 1; i <= count; i++) {
                bookmarkList.push(bookmarks.Item(i).Name);
            }

            return bookmarkList;
        }

        // ========== 书签相关函数

        // ==========对话框相关函数

        /**
         * params = {
         *
         * 无返回值
         */
        yozoExt.apis.printDoc = function(params = {}) {
            const doc = getDoc(params);

            doc.Activate();

            const yozoApp = yozoApp;
            yozoApp.Dialogs.Item(enums.WdWordDialog.wdDialogFilePrint).Show();
        }

        /**
         * params = {
         * }
         *
         * 无返回值
         */
        yozoExt.apis.showDialog = function(params = {}) {
            const doc = getDoc(params);
            const wdWordDialog = params.wdWordDialog;
            const dialogs = doc.Application.Dialogs;

            dialogs.Item(wdWordDialog).Show();
        }

        /**
         * params = {
         *
         * 无返回值
         */
        yozoExt.apis.printPreview = function(params = {}) {
            const doc = yozoExt.apis.getDoc(params);
            doc.PrintPreview();
        }

        // ==========对话框相关函数

        // ==========文档相关函数

        /**
         * 注意：该方法不返回Promise
         */
        yozoExt.apis.getDoc = function(params) {
            if (params && params.docName) {
                const docs = yozoApp.Documents;
                const count = docs.Count;

                for (let i = 0; i < count; i++) {
                    const doc = docs.Item(i);
                    if (params.docName === doc.Name) {
                        doc.Activate();
                        return doc;
                    }
                }

                throw Error('未找到指定文档');
            } else {
                return yozoApp.ActiveDocument;
            }
        }

        /**
         * params = {
         * }
         *
         * 无返回值
         */
        yozoExt.apis.newDoc = function() {
            yozoApp.Documents.Add();
            
        }

        /**
         * params = {
         *     filePath, // 文件路径，如果不传递该参数则打开一个选择框
         *     readOnly, // true或false，是否以只读模式打开
         *     revisionMode: true或false，是否以修订模式打开
         * }
         *
         * 返回值 = {
         *     filePath: 打开的文件路径, 如果用户取消打开则该值为undefined,
         * }
         *
         */
        yozoExt.apis.openLocalDoc = function(
            params = {readOnly: false, revisionMode: false}
        ) {
            const app = yozoApp;
            const readOnly = !!params.readOnly;
            let filePath = params.filePath;
			
           // if (!filePath && app.FileDialog(1).Show() === -1) {
           //     filePath = app.FileDialog(1).SelectedItems.Item(1);
           // }
		   if(!filePath){
				let dlg = app.FileDialog(1);
				dlg.Show(function (dlg) {
					filePath = dlg.SelectedItems.Item(1);
					console.log("filePath======"+filePath);
					if (filePath) {
						console.log(`是否只读模式打开: ${readOnly}`);
						yozoObj.LoadDocument(filePath, readOnly);

						if (params.revisionMode) {
							getDoc(params).TrackRevisions = true;
						}
					}
				});
		   }else{
				console.log(`是否只读模式打开: ${readOnly}`);
				yozoObj.LoadDocument(filePath, readOnly);

				if (params.revisionMode) {
					getDoc(params).TrackRevisions = true;
				}
			}
            return {filePath: filePath};
        }

        /**
         * params = {
         *     url, // 远程文档的URL，必须是http://......这一类的地址
         *     readOnly, // true或false，是否以只读模式打开
         *     revisionMode: true或false，是否以修订模式打开
         * }
         *
         * 返回值：远程文档在本地的临时路径。
         *
         * 异常：如果远程文档下载失败，则会抛出异常。由于YOZO方实现的原因，无法得知具体的异常信息。
         */
        yozoExt.apis.openRemoteDoc = function(
            params = {readOnly: false, revisionMode: false}
        ) {
            if (!params || !params.url) {
                throw Error('openRemoteDoc必须传入param.url参数');
            }
            if (params.url.indexOf('http') !== 0) {
                throw Error('param.url参数必须是http开头');
            }

            const readOnly = !!params.readOnly;

            try {
                const localTmpPath = yozoObj.DownloadFile(params.url);
				console.log("localTmpPath==="+localTmpPath);
                yozoObj.LoadDocument(localTmpPath, readOnly);

                if (params.revisionMode) {
                    getDoc(params).TrackRevisions = true;
                }
				
                return localTmpPath;
            } catch (e) {
                throw Error('打开远程YOZO文档失败，请检查地址是否有效: ' + params.url);
            }
        }

        /**
         * ，会调用Promise.reject('用户已取消保存')
         *
         * params = {
         *     savePath, //保存的路径, 如果不提供的话，则弹出对话框选择保存路径
         * }
         *
         * 返回值 = {
         *     savePath, // 保存路径, 如果用户取消保存则该值为undefined
         * }
         */
        yozoExt.apis.saveToLocal = function(params = {}) {
            const app = yozoApp;
            const doc = getDoc(params);
            let savePath = params.savePath;

            if (!savePath) {
				let dlg = app.FileDialog(2);
				dlg.Show(function (dlg) {
					savePath = dlg.SelectedItems.Item(2);
					doc.SaveAs2(savePath);
				});
               // if (app.FileDialog(2).Show() === -1) {
                //    savePath = app.FileDialog(2).SelectedItems.Item(1);
               //     doc.SaveAs2(savePath);
                //}
            } else {
                doc.SaveAs2(savePath);
            }

            return {savePath: savePath};
        }

        /**
         * params = {
         *     url, // 文件的保存地址
         * }
         *
         * 返回值：服务器的响应
         *
         * 异常：当上传到服务器失败时，会抛出异常，由于YOZO方的原因，无法得知具体的异常信息
         */
        yozoExt.apis.saveToRemote = function(params = {}) {
            const doc = getDoc(params);
            //debugger
            doc.Activate();

            if (!params.url || params.url.trim() === '') {
                throw Error('saveToRemote必须传入param.url参数');
            }
            if (params.url.indexOf('http') !== 0) {
                throw Error('param.url参数必须是http开头');
            }

            const tmpSavePath = `${yozoObj.GetTempPath()}` + new Date().getMilliseconds();
            const v = yozoExt.apis.saveToLocal({savePath: tmpSavePath});
            try {
                return yozoObj.UploadFile(params.url, `${doc.Path}/${doc.Name}`);
            } catch (e) {
                throw Error(
                    'YOZO文档保存到服务器失败，请检查地址是否有效: ' + params.url
                );
            }
        }

        /**
         * 无参数
         *
         * 返回值：如果指定的文档或模板从上次保存后一直没有更改，则该属性值为 True。如果关闭文档时，YOZO 提示保存对文档所做的更改，则该属性值为 False
         */
        yozoExt.apis.saved = function(params = {}) {
            const doc = getDoc(params);

            doc.Activate();

            return doc.Saved;
        }

        /**
         * params = {
         * }
         *
         * 无返回值
         */
        yozoExt.apis.setUserName = function(params = {}) {
            const doc = getDoc(params);
            const userName = params.userName;

            if (!userName) {
                throw Error(`setUserName必须传入正确的参数, userName: ${userName}`);
            }

            doc.Application.UserName = userName;
        }

        /**
         * params = {
         *     text, // 要查找的文本内容
         * }
         *
         * 返回值：boolean，是否找到
         */
        yozoExt.apis.findText = function(params = {}) {
            const doc = getDoc(params);
            const text = params.text;
            const continueFind = 1; // 到达搜索范围的开始或结尾时，继续执行查找操作

            // 详见word开发文档, Find.Execute
            return doc.Application.Selection.Find.Execute(
                text,
                false,
                false,
                false,
                false,
                false,
                true,
                continueFind,
                false
            );
        }

        /**
         * params = {
         *     to, // 要替换成的文本
         * }
         *
         * 返回值：boolean，是否有替换到
         */
        yozoExt.apis.findAndReplace = function(params = {}) {
			console.log("==================="+params.from);
            const doc = getDoc(params);
            const from = params.from;
            const to = params.to;
            const continueFind = 1; // 到达搜索范围的开始或结尾时，继续执行查找操作
            const replaceType = 1; // 只替换第一个

            // 详见word开发文档, Find.Execute
            return doc.Application.Selection.Find.Execute(
                from,
                false,
                false,
                false,
                false,
                false,
                true,
                continueFind,
                false,
                to,
                replaceType
            );
        }

        /**
         * params = {
         *
         * 无返回值
         */
        yozoExt.apis.acceptAllRevisions = function(params) {
            const doc = getDoc(params);
            doc.AcceptAllRevisions();
        }

        // ==========文档相关函数

        // ==========文档属性相关函数

        /**
         * params = {
         *     value, // 属性值
         * }
         *
         * 无返回值
         */
        yozoExt.apis.setDocProperty = function(params = {}) {
            const doc = getDoc(params);

            const item = doc.BuiltInDocumentProperties.Item(params.name);

            item.Value = params.value;
        }

        /**
         * params = {
         * }
         *
         * 返回值 = {
         *     value, // 文档属性值
         * }
         *
         * 如果指定的文档属性不存在则抛出异常
         */
        yozoExt.apis.getDocProperty = function(params = {}) {
            const doc = getDoc(params);

            const item = doc.BuiltInDocumentProperties.Item(params.name);
            if (item) {
                return {文档属性值value: item.Value};
            } else {
                throw Error(`文档属性[${params.name}]不存在`);
            }
        }

        /**
         * params = {
         * }
         *
         * 无返回值
         *
         * 如果指定的文档属性不存在则抛出异常
         */
        yozoExt.apis.deleteDocProperty = function(params = {}) {
            const doc = getDoc(params);

            const item = doc.BuiltInDocumentProperties.Item(params.name);
            if (item) {
                item.Delete();
            } else {
                throw Error(`文档属性[${params.name}]不存在`);
            }
        }

        // ==========文档属性相关函数

        // ==========超链接相关函数

        /**
         * params = {
         *     address, // 超链接地址
         * }
         *
         * 无返回值
         */
        yozoExt.apis.insertHyperlink = function(params = {}) {
            const doc = getDoc(params);
            const selection = doc.Application.Selection;

            const text = params.text;
            if (text) {
                selection.InsertAfter(text);
            }

            const range = selection.Range;
            const address = params.address;

            doc.Hyperlinks.Add(range, address);
        }

        // ==========超链接相关函数

        // ==========图片相关函数

        /**
         * params = {
         *     picPath，// 图片的地址
         *     height, // 图片的高度
         *     width, // 图片的宽度
         *     shapeType, // 是否转换为粘贴型图片
         *     horizontalPos, // 图片的相对水平位置, 可设置的值详见Yozo.enums.WdRelativeHorizontalPosition
         *     verticalPos, // 图片的相对垂直位置, 可设置的值详见Yozo.enums.WdRelativeHorizontalPosition
         *     left, // 设置指定形状或形状范围的水平位置（以磅为单位）
         *     top, // 设置指定形状或形状范围的垂直位置（以磅为单位）
         * }
         *
         * 无返回值
         */
        yozoExt.apis.insertImage = function(params = {}) {
            const doc = getDoc(params);
            doc.Activate();

            const picPath = params.picPath;
            if (!picPath) {
                throw Error('insertImage必须提供params.picPath参数');
            }

            const selection = yozoApp.ActiveWindow.Selection;
            const pic = selection.InlineShapes.AddPicture(picPath, false, true);

            if (!pic) {
                throw Error(`图片插入失败, 请确认图片是否存在: ${picPath}`);
            }

            const height = params.height;
            const width = params.width;

            pic.LockAspectRatio = 0;

            if (height) {
                pic.Height = height;
            }
            if (width) {
                pic.Width = width;
            }

            pic.Select();

            if (
                params.shapeType &&
                params.horizontalPos !== undefined &&
                params.verticalPos !== undefined &&
                params.left !== undefined &&
                params.top !== undefined
            ) {
                const sealShape = pic.ConvertToShape();

                sealShape.RelativeHorizontalPosition = params.horizontalPos;
                sealShape.RelativeVerticalPosition = params.verticalPos;
                sealShape.Left = params.left;
                sealShape.Top = params.top;
            }
        }

        /**
         * params = {
         *     picPath, // 图片的地址
         *     height, // 图片的高度
         *     width, // 图片的宽度
         *     left, // 设置指定形状或形状范围的水平位置（以磅为单位）
         *     top, // 设置指定形状或形状范围的垂直位置（以磅为单位）
         *     sectionIndex, // 整数，从1开始，表示插入到第sectionIndex个节的页脚, 如不填写则默认是最后一节
         *     linkToPrevious, // 是否取消“同前节”,
         *     toInlineImage, // 是否转为嵌入型图片,
         *     position, // 对齐方式，可以是Yozo.enums.WdShapePosition常量之一
         * }
         *
         * 无返回值
         */
        yozoExt.apis.insertImageToFooter = function(params = {}) {
            const doc = getDoc(params);
            doc.Activate();

            const picPath = params.picPath;
            if (!picPath) {
                throw Error('insertImage必须提供params.picPath参数');
            }

            let section;
		
            if (params.sectionIndex) {
                if (doc.Sections.Count < params.sectionIndex) {
                    throw Error(`sectionIndex(${params.sectionIndex})超过当前文档总节数: ${doc.Sections.Count}`);
                }

                section = doc.Sections.Item(params.sectionIndex);
            } else {
                console.log(doc.Sections.Count);
                section = doc.Sections.Item(doc.Sections.Count);
            }


            const footers = section.Footers;
            const footer = footers.Item(enums.WdHeaderFooterIndex.wdHeaderFooterPrimary);


            const r = doc.Application.Selection.Range;
            // YOZO的bug，必须先把光标聚焦到页脚才能插入图片, 已反馈，待修复(2019-08-01)
            footer.Range.Select();

            try {
                footer.LinkToPrevious = !!params.linkToPrevious;
                //const pic = footer.Shapes.AddPicture(picPath, false, true, params.left, params.top, params.width, params.height);
				//先临时改为这样，后续查到原因在改回来
				var footer1 = section.Footers.Item(enums.WdHeaderFooterIndex.wdHeaderFooterPrimary);
                const pic = footer1.Shapes.AddPicture(picPath, false, true, params.left, params.top, params.width, params.height);

                if (!pic) {
                    throw Error(`图片插入失败, 请确认图片是否存在: ${picPath}`);
                }

                if (params.position) {
                    pic.Left = params.position;
                }

                if (params.toInlineImage) {
                    pic.ConvertToInlineShape();
                }
            } finally {
                doc.Activate();
                r.Select();
            }
        }

        // ==========图片相关函数

        // ==========分节符相关函数

        /**
         * 无参数
         */
        yozoExt.apis.getSectionCount = function(params = {}) {
            const doc = getDoc(params);
            doc.Activate();

            return doc.Sections.Count;
        }

        /**
         * params = {
         *     page, // 在第page个页面的前一页的末尾插入分节符, 该参数优先于range参数
         *     range, // 要在其之前插入分节符的区域。如果省略该参数，则将分节符插至文档末尾,
         *     start, // 要添加的分节符的类型。可以是 enums.WdSectionStart 常量之一。如果省略该参数，则添加“下一页”类型的分节符。
         * }
         *
         * 无返回值
         */
        yozoExt.apis.addSection = function(params = {}) {
            const doc = getDoc(params);
            doc.Activate();

            if (params.page) {
                const count = doc.ActiveWindow.ActivePane.Pages.Count;
                if (params.page > count) {
                    throw Error(`page(${params.page})超过当前文档总页数: ${count}`);
                }

                const page = doc.ActiveWindow.ActivePane.Pages.Item(params.page);
                doc.Sections.Add(page.Breaks.Item(1).Range, params.start);
            } else {
                doc.Sections.Add(params.range, params.start);
            }
        }


        // ==========分节符相关函数

        // ==========文档保护相关函数

        /**
         * params = {
         *     password, // 密码
         * }
         *
         * 无返回值
         */
        yozoExt.apis.protect = function(params = {}) {
            const doc = getDoc(params);
            const protectionType = params.protectionType;
            const password = params.password;

            if (protectionType !== doc.ProtectionType) {
                doc.Protect(protectionType, null, password);
            }

            if (!params.force) {
                return;
            }

            const tables = doc.Tables;
            const tableCount = tables.Count;
            if (tableCount <= 0) {
                return;
            }

            for (let tableIndex = 1; tableIndex <= tableCount; tableIndex++) {
                const table = tables.Item(tableIndex);
                const rowCount = table.Rows.Count;
                const colCount = table.Columns.Count;

                for (let i = 1; i <= rowCount; i++) {
                    for (let j = 1; j <= colCount; j++) {
                        try {
                            const cell = table.Cell(i, j);
                            console.log(i, j)
                            if (
                                cell === null ||
                                cell === undefined ||
                                !cell.Range ||
                                !cell.Range.Editors
                            ) {
                                continue
                            }

                            const editors = cell.Range.Editors;

                            while (editors.Count > 0) {
                                editors.Item(1).Delete();
                            }
                        } catch (e) {
                            // 忽略异常
                            continue;
                        }
                    }
                }
            }
        }

        /**
         * params = {
         * }
         *
         * 无返回值
         */
        yozoExt.apis.unprotect = function(params = {}) {
            const doc = getDoc(params);
            const password = params.password;

            if (doc.ProtectionType !== -1) {
                doc.Unprotect(password);
            }
        }

        /**
         * params = {
         *
         * 返回值 = {
         *     protectionType, // 保护类型枚举值
         * }
         */
        yozoExt.apis.getProtectionType = function(params = {}) {
            const doc = getDoc(params);
            const protectionType = doc.ProtectionType;

            return {protectionType: protectionType};
        }

        // ==========文档保护相关函数

        // ==========表格相关函数

        yozoExt.apis.__ensureIndex = function(
            params,
            tables,
            requireColIndex = false,
            requireRowIndex = false
        ) {
            if (!params || !tables) {
                return;
            }

            const tableIndex = params.tableIndex;
            const rowIndex = params.rowIndex;
            const colIndex = params.colIndex;

            if (tableIndex === 0) throw Error(`表的下标不允许为0, 从1开始计数`);
            if (rowIndex === 0) throw Error(`表的行下标不允许为0, 从1开始计数`);
            if (colIndex === 0) throw Error(`表的列下标不允许为0, 从1开始计数`);

            if (!tableIndex) throw Error(`参数不合法, 未提供params.tableIndex`);
            if (tableIndex > tables.Count)
                throw Error(
                    `表索引溢出, 表数量: ${tables.Count || 0}, 下标参数: ${tableIndex}`
                );

            if (requireRowIndex && !rowIndex)
                throw Error(`参数不合法, 未提供params.rowIndex`);
            if (requireColIndex && !colIndex)
                throw Error(`参数不合法, 未提供params.colIndex`);

            if (!colIndex && !rowIndex) {
                return;
            }

            const table = tables.Item(tableIndex);

            if (colIndex && colIndex > table.Columns.Count) {
                throw Error(
                    `列索引溢出, 列数量: ${table.Columns.Count}, 下标参数: ${colIndex}`
                );
            }
            if (rowIndex > table.Rows.Count) {
                throw Error(
                    `行索引溢出, 行数量: ${table.Rows.Count}, 下标参数: ${rowIndex}`
                );
            }
        }

        /**
         * params = {
         *     colIndex, // 要删除的列索引, 从1开始
         * }
         *
         * 无返回值
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.deleteTableColumn = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;

            yozoExt.apis.__ensureIndex(params, tables, true);

            const table = tables.Item(tableIndex);

            table.Columns.Item(params.colIndex).Delete();
        }

        /**
         * params = {
         *     rowIndex, // 要删除的行索引,  从1开始
         * }
         *
         * 无返回值
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.deleteTableRow = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;

            yozoExt.apis.__ensureIndex(params, tables, false, true);

            const table = tables.Item(tableIndex);

            table.Rows.Item(params.rowIndex).Delete();
        }

        /**
         * params = {
         *     colIndex, // 列下表, 从1开始
         *     rowIndex, // 行下标, 从1开始
         *     text,  // 单元格值
         * }
         *
         * 无返回值
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.setTableCellValue = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;
            const colIndex = params.colIndex;
            const rowIndex = params.rowIndex;
            const text = params.text;

            yozoExt.apis.__ensureIndex(params, tables, true, true);

            const table = tables.Item(tableIndex);
            const range = table.Cell(rowIndex, colIndex).Range;
            range.Select();
            range.Text = text;
        }

        /**
         * params = {
         *     tableIndex, // 表格下标，从1开始
         *     cellList: [{
         *         colIndex, // 列下表, 从1开始
         *         rowIndex // 行下标, 从1开始
         *     }, {
         *         colIndex,
         *         rowIndex
         *     },
         *     ...
         *     ]
         *     password, // 密码
         * }
         *
         * 无返回值
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.docProtectExceptCell = function(params = {}) {
            if (!params.cellList || params.cellList < 1)
                throw Error(`至少需要指定一个要保护的单元格`);

            const doc = getDoc(params);
            const password = params.password;

            // 先解锁文档
            const unprotectParams = {
                doc: doc,
                password: password
            };

            yozoExt.apis.unprotect(unprotectParams);

            // 重新以只读的方式加锁
            const protectParams = {
                doc: doc,
                password: password,
                protectionType: 3 // 只读
            };

            yozoExt.apis.protect(protectParams);

            // 此时整个文档都是只读的, 然后再设置允许编辑的表格部分
            const tables = doc.Tables;

            yozoExt.apis.__ensureIndex(params, tables);

            const tableIndex = params.tableIndex;
            const table = tables.Item(tableIndex);

            const cellCount = params.cellList.length;
            for (let i = 0; i < cellCount; i++) {
                const rowIndex = params.cellList[i].rowIndex;
                const colIndex = params.cellList[i].colIndex;

                try {
                    yozoExt.apis.__ensureIndex(
                        {
                            tableIndex: tableIndex,
                            rowIndex: rowIndex,
                            colIndex: colIndex
                        },
                        tables,
                        true,
                        true
                    );
                } catch (e) {
                    console.warn(e);
                    continue;
                }

                const cell = table.Cell(rowIndex, colIndex);
                cell.Range.Editors.Add(-1); // 允许所有打开文档的用户编辑
            }
        }

        /**
         * params = {
         *     colIndex, // 插入到colIndex之前, 不设置该字段则插入到最后一列之后
         * }
         *
         * 无返回值
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.addTableColumn = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;

            yozoExt.apis.__ensureIndex(params, tables);

            const table = tables.Item(tableIndex);

            if (params.colIndex) {
                const beforeColumn = table.Columns.Item(params.colIndex);
                table.Columns.Add(beforeColumn);
            } else {
                table.Columns.Add();
            }
        }

        /**
         * params = {
         *     rowIndex, // 插入到rowIndex之前, 不设置该字段则插入到最后一行之后
         * }
         *
         * 无返回值
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.addTableRow = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;

            yozoExt.apis.__ensureIndex(params, tables);

            const table = tables.Item(tableIndex);

            if (params.rowIndex) {
                const beforeRow = table.Rows.Item(params.rowIndex);
                table.Rows.Add(beforeRow);
            } else {
                table.Rows.Add();
            }
        }

        /**
         * params = {
         *     colIndex, // 列下表, 从1开始
         *     rowIndex, // 行下标, 从1开始
         * }
         *
         * 无返回值
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.goToTable = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;

            yozoExt.apis.__ensureIndex(params, tables);

            const table = tables.Item(tableIndex);

            const colIndex = params.colIndex;
            const rowIndex = params.rowIndex;

            if (colIndex && rowIndex) {
                yozoExt.apis.__ensureIndex(params, tables, true, true);

                table.Cell(rowIndex, colIndex).Select();
            } else {
                table.Select();
            }
        }

        /**
         * params = {
         *     colIndex, // 列下表, 从1开始
         *     rowIndex, // 行下标, 从1开始
         *     cb, // 回调函数, 接收一个参数: text, 指定单元格的内容
         * }
         *
         * 返回值 = {
         *     text, //指定单元格的值
         * }
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.getTableCellValue = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;
            const colIndex = params.colIndex;
            const rowIndex = params.rowIndex;

            yozoExt.apis.__ensureIndex(params, tables, true, true);

            const table = tables.Item(tableIndex);
            const range = table.Cell(rowIndex, colIndex).Range;

            // FIXME 12.0版YOZO总最后总会多出一个ascii码为7的字符
            if (range.Text.endsWith('\ra')) {
                return range.Text.substring(0, range.Text.length - 2)
            }

            return {text: range.Text.replace('\ra', '')};
        }

        /**
         * params = {
         *     // colIndex, // 可选, 列下表, 从1开始
         *     cb, // 回调函数, 接收一个参数: count, 指定表(的指定列)的行数
         * }
         *
         * 返回值 = {
         *     count, // 行数
         * }
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.getTableRowCount = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;
            const colIndex = params.colIndex;

            if (colIndex) {
                yozoExt.apis.__ensureIndex(params, tables, true);

                const table = tables.Item(tableIndex);
                const rowCount = table.Rows.Count;

                let count = 0;
                for (let i = 1; i <= rowCount; i++) {
                    const cell = table.Cell(i, colIndex);

                    if (cell === null || cell === undefined) {
                        continue;
                    }
                    if (cell.RowIndex !== i || cell.ColumnIndex !== colIndex) {
                        continue;
                    }

                    count++;
                }

                return {count: count}
            } else {
                yozoExt.apis.__ensureIndex(params, tables);

                const table = tables.Item(tableIndex);

                return {count: table.Rows.Count};
            }
        }

        /**
         * params = {
         *     // rowIndex, // 可选，列下表, 从1开始
         *     cb, // 回调函数, 接收一个参数: count, 指定表(的指定行)的列数
         * }
         *
         * 返回值 = {
         *     count, // 列数
         * }
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.getTableColCount = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;
            const rowIndex = params.rowIndex;

            if (rowIndex) {
                yozoExt.apis.__ensureIndex(params, tables, false, true);

                const table = tables.Item(tableIndex);
                const colCount = table.Columns.Count;

                let count = 0;
                for (let i = 1; i <= colCount; i++) {
                    const cell = table.Cell(rowIndex, i);

                    if (cell === null || cell === undefined) {
                        continue;
                    }
                    if (cell.RowIndex !== rowIndex || cell.ColumnIndex !== i) {
                        continue;
                    }

                    count++;
                }

                return {count: count}
            } else {
                yozoExt.apis.__ensureIndex(params, tables);

                const table = tables.Item(tableIndex);

                return {count: table.Columns.Count};
            }
        }

        /**
         * params = {
         *     cb, // 回调函数, 接收一个参数: count, 表示文档表格数量
         * }
         *
         * 返回值 = {
         *     count, // 表数量
         * }
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.getTableCount = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;

            return {count: tables.Count || 0};
        }

        /**
         * params = {
         *     text, // 要定位的文本
         *     cb, // 回调函数, 接收两个参数: rowIndex和colIndex, 表示指定内容所在行索引和列索引, 不存在时两个参数的值都为-1
         * }
         *
         * 返回值 {
         *     rowIndex, // 文本在表中的行下标, 不存在时该字段值为-1
         *     colIndex, //  文本在表中的列下标, 不存在时该字段值为-1
         * }
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.getTableTextIndex = function(params = {}) {
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;
            const text = params.text;

            yozoExt.apis.__ensureIndex(params, tables);

            const table = tables.Item(tableIndex);
            const rowCount = table.Rows.Count;
            const colCount = table.Columns.Count;

            for (let i = 1; i <= rowCount; i++) {
                for (let j = 1; j <= colCount; j++) {
                    const cell = table.Cell(i, j);

                    if (cell === null || cell === undefined) {
                        continue;
                    }
                    if (cell.RowIndex !== i || cell.ColumnIndex !== j) {
                        continue;
                    }

                    // YOZO的单元格取值最后都会有\r\a
                    let t = cell.Range.Text;
                    if (!t || t.length === 0) {
                        continue;
                    }
                    if (t[t.length - 1].charCodeAt(0) === 7) {
                        t = t.substring(0, t.length - 1);
                    }
                    if (t[t.length - 1].charCodeAt(0) === 13) {
                        t = t.substring(0, t.length - 1)
                    }

                    if (t === text) {
                        return {
                            rowIndex: i,
                            colIndex: j
                        };
                    }
                }
            }

            return {
                rowIndex: -1,
                colIndex: -1
            };
        }

        /**
         * params = {
         *     text, // 要匹配的文本
         *     cb, // 回调函数, 接收一个参数: count, 表示包含指定文本的行数(同一行多次出现仅算一次)
         * }
         *
         * 返回值 = {
         *     count, // 包含指定文本的行的数量
         * }
         *
         * 索引若溢出则抛出异常
         */
        yozoExt.apis.getTableTextOccurRowCount = function(params = {}) {
            // FIXME 计算错误
            const doc = getDoc(params);
            const tables = doc.Tables;
            const tableIndex = params.tableIndex;
            const text = params.text;

            yozoExt.apis.__ensureIndex(params, tables);

            const table = tables.Item(tableIndex);

            const rowCount = table.Rows.Count;
            const colCount = table.Columns.Count;

            let count = 0;
            for (let i = 1; i <= rowCount; i++) {
                for (let j = 1; j <= colCount; j++) {
                    const cell = table.Cell(i, j);

                    if (cell === null || cell === undefined) {
                        continue;
                    }
                    if (cell.RowIndex !== i || cell.ColumnIndex !== j) {
                        continue;
                    }

                    // YOZO的单元格取值最后都会有\r\a
                    let t = cell.Range.Text;
                    if (!t || t.length === 0) {
                        continue;
                    }
                    if (t[t.length - 1].charCodeAt(0) === 7) {
                        t = t.substring(0, t.length - 1);
                    }
                    if (t[t.length - 1].charCodeAt(0) === 13) {
                        t = t.substring(0, t.length - 1);
                    }

                    console.log(t);

                    if (t === text) {
                        count++;
                        break;
                    }
                }
            }

            return {count: count};
        }

        /**
         * params = {
         * }
         *
         * 无返回值
         */
        yozoExt.apis.shadeEditableRanges = function(params = {}) {
            const doc = getDoc(params);

            doc.ActiveWindow.View.ShadeEditableRanges = params.show;
        }

        // ==========表格相关函数

        // ==========文本相关函数

        /**
         * params = {
         * }
         *
         * 无返回值
         */
        yozoExt.apis.insertText = function(params = {}) {
            const doc = getDoc(params);
            const text = params.text;
            const selection = doc.Application.Selection;

            selection.InsertAfter(text);
        }

        /**
         * params = {
         *
         * 返回值 = {
         *     text, // 选中的文本
         * }
         */
        yozoExt.apis.getSelectedText = function(params = {}) {
            const doc = getDoc(params);

            return {text: doc.ActiveWindow.Selection.Range.Text};
        }

        // ==========文本相关函数

        return yozoExt
    }
    var enums = {
        WdWordDialog: {
            wdDialogHelpAbout: 9,
            wdDialogHelpWordPerfectHelp: 10,
            wdDialogDocumentStatistics: 78,
            wdDialogFileNew: 79,
            wdDialogFileOpen: 80,
            wdDialogMailMergeOpenDataSource: 81,
            wdDialogMailMergeOpenHeaderSource: 82,
            wdDialogFileSaveAs: 84,
            wdDialogFileSummaryInfo: 86,
            wdDialogToolsTemplates: 87,
            wdDialogFilePrint: 88,
            wdDialogFilePrintSetup: 97,
            wdDialogFileFind: 99,
            wdDialogFormatAddrFonts: 103,
            wdDialogEditPasteSpecial: 111,
            wdDialogEditFind: 112,
            wdDialogEditReplace: 117,
            wdDialogEditStyle: 120,
            wdDialogEditLinks: 124,
            wdDialogEditObject: 125,
            wdDialogTableToText: 128,
            wdDialogTextToTable: 127,
            wdDialogTableInsertTable: 129,
            wdDialogTableInsertCells: 130,
            wdDialogTableInsertRow: 131,
            wdDialogTableDeleteCells: 133,
            wdDialogTableSplitCells: 137,
            wdDialogTableRowHeight: 142,
            wdDialogTableColumnWidth: 143,
            wdDialogToolsCustomize: 152,
            wdDialogInsertBreak: 159,
            wdDialogInsertSymbol: 162,
            wdDialogInsertPicture: 163,
            wdDialogInsertFile: 164,
            wdDialogInsertDateTime: 165,
            wdDialogInsertField: 166,
            wdDialogInsertMergeField: 167,
            wdDialogInsertBookmark: 168,
            wdDialogMarkIndexEntry: 169,
            wdDialogInsertIndex: 170,
            wdDialogInsertTableOfContents: 171,
            wdDialogInsertObject: 172,
            wdDialogToolsCreateEnvelope: 173,
            wdDialogFormatFont: 174,
            wdDialogFormatParagraph: 175,
            wdDialogFormatSectionLayout: 176,
            wdDialogFormatColumns: 177,
            wdDialogFileDocumentLayout: 178,
            wdDialogFilePageSetup: 178,
            wdDialogFormatTabs: 179,
            wdDialogFormatStyle: 180,
            wdDialogFormatDefineStyleFont: 181,
            wdDialogFormatDefineStylePara: 182,
            wdDialogFormatDefineStyleTabs: 183,
            wdDialogFormatDefineStyleFrame: 184,
            wdDialogFormatDefineStyleBorders: 185,
            wdDialogFormatDefineStyleLang: 186,
            wdDialogFormatPicture: 187,
            wdDialogToolsLanguage: 188,
            wdDialogFormatBordersAndShading: 189,
            wdDialogFormatFrame: 190,
            wdDialogToolsThesaurus: 194,
            wdDialogToolsHyphenation: 195,
            wdDialogToolsBulletsNumbers: 196,
            wdDialogToolsHighlightChanges: 197,
            wdDialogToolsRevisions: 197,
            wdDialogToolsCompareDocuments: 198,
            wdDialogTableSort: 199,
            wdDialogToolsOptionsGeneral: 203,
            wdDialogToolsOptionsView: 204,
            wdDialogToolsAdvancedSettings: 206,
            wdDialogToolsOptionsPrint: 208,
            wdDialogToolsOptionsSave: 209,
            wdDialogToolsOptionsSpellingAndGrammar: 211,
            wdDialogToolsOptionsUserInfo: 213,
            wdDialogToolsMacroRecord: 214,
            wdDialogToolsMacro: 215,
            wdDialogWindowActivate: 220,
            wdDialogFormatRetAddrFonts: 221,
            wdDialogOrganizer: 222,
            wdDialogToolsOptionsEdit: 224,
            wdDialogToolsOptionsFileLocations: 225,
            wdDialogToolsWordCount: 228,
            wdDialogControlRun: 235,
            wdDialogInsertPagvarbers: 294,
            wdDialogFormatPagvarber: 298,
            wdDialogCopyFile: 300,
            wdDialogFormatChangeCase: 322,
            wdDialogUpdateTOC: 331,
            wdDialogInsertDatabase: 341,
            wdDialogTableFormula: 348,
            wdDialogFormFieldOptions: 353,
            wdDialogInsertCaption: 357,
            wdDialogInsertCaptionNumbering: 358,
            wdDialogInsertAutoCaption: 359,
            wdDialogFormFieldHelp: 361,
            wdDialogInsertCrossReference: 367,
            wdDialogInsertFootnote: 370,
            wdDialogNoteOptions: 373,
            wdDialogToolsAutoCorrect: 378,
            wdDialogToolsOptionsTrackChanges: 386,
            wdDialogConvertObject: 392,
            wdDialogInsertAddCaption: 402,
            wdDialogConnect: 420,
            wdDialogToolsCustomizeKeyboard: 432,
            wdDialogToolsCustomizeMenus: 433,
            wdDialogToolsMergeDocuments: 435,
            wdDialogMarkTableOfContentsEntry: 442,
            wdDialogFileMacPageSetupGX: 444,
            wdDialogFilePrintOneCopy: 445,
            wdDialogEditFrame: 458,
            wdDialogMarkCitation: 463,
            wdDialogTableOfContentsOptions: 470,
            wdDialogInsertTableOfAuthorities: 471,
            wdDialogInsertTableOfFigures: 472,
            wdDialogInsertIndexAndTables: 473,
            wdDialogInsertFormField: 483,
            wdDialogFormatDropCap: 488,
            wdDialogToolsCreateLabels: 489,
            wdDialogToolsProtectDocument: 503,
            wdDialogFormatStyleGallery: 505,
            wdDialogToolsAcceptRejectChanges: 506,
            wdDialogHelpWordPerfectHelpOptions: 511,
            wdDialogToolsUnprotectDocument: 521,
            wdDialogToolsOptionsCompatibility: 525,
            wdDialogTableOfCaptionsOptions: 551,
            wdDialogTableAutoFormat: 563,
            wdDialogMailMergeFindRecord: 569,
            wdDialogReviewAfmtRevisions: 570,
            wdDialogViewZoom: 577,
            wdDialogToolsProtectSection: 578,
            wdDialogFontSubstitution: 581,
            wdDialogInsertSubdocument: 583,
            wdDialogNewToolbar: 586,
            wdDialogToolsEnvelopesAndLabels: 607,
            wdDialogFormatCallout: 610,
            wdDialogTableFormatCell: 612,
            wdDialogToolsCustomizeMenuBar: 615,
            wdDialogFileRoutingSlip: 624,
            wdDialogEditTOACategory: 625,
            wdDialogToolsManageFields: 631,
            wdDialogDrawSnapToGrid: 633,
            wdDialogDrawAlign: 634,
            wdDialogMailMergeCreateDataSource: 642,
            wdDialogMailMergeCreateHeaderSource: 643,
            wdDialogMailMerge: 676,
            wdDialogMailMergeCheck: 677,
            wdDialogMailMergeHelper: 680,
            wdDialogMailMergeQueryOptions: 681,
            wdDialogFileMacPageSetup: 685,
            wdDialogListCommands: 723,
            wdDialogEditCreatePublisher: 732,
            wdDialogEditSubscribeTo: 733,
            wdDialogEditPublishOptions: 735,
            wdDialogEditSubscribeOptions: 736,
            wdDialogFileMacCustomPageSetupGX: 737,
            wdDialogToolsOptionsTypography: 739,
            wdDialogToolsAutoCorrectExceptions: 762,
            wdDialogToolsOptionsAutoFormatAsYouType: 778,
            wdDialogMailMergeUseAddressBook: 779,
            wdDialogToolsHangulHanjaConversion: 784,
            wdDialogToolsOptionsFuzzy: 790,
            wdDialogEditGoToOld: 811,
            wdDialogInsertNumber: 812,
            wdDialogLetterWizard: 821,
            wdDialogFormatBulletsAndNumbering: 824,
            wdDialogToolsSpellingAndGrammar: 828,
            wdDialogToolsCreateDirectory: 833,
            wdDialogTableWrapping: 854,
            wdDialogFormatTheme: 855,
            wdDialogTableProperties: 861,
            wdDialogEmailOptions: 863,
            wdDialogCreateAutoText: 872,
            wdDialogToolsAutoSummarize: 874,
            wdDialogToolsGrammarSettings: 885,
            wdDialogEditGoTo: 896,
            wdDialogWebOptions: 898,
            wdDialogInsertHyperlink: 925,
            wdDialogToolsAutoManager: 915,
            wdDialogFileVersions: 945,
            wdDialogToolsOptionsAutoFormat: 959,
            wdDialogFormatDrawingObject: 960,
            wdDialogToolsOptions: 974,
            wdDialogFitText: 983,
            wdDialogEditAutoText: 985,
            wdDialogPhoneticGuide: 986,
            wdDialogToolsDictionary: 989,
            wdDialogFileSaveVersion: 1007,
            wdDialogToolsOptionsBidi: 1029,
            wdDialogFrameSetProperties: 1074,
            wdDialogTableTableOptions: 1080,
            wdDialogTableCellOptions: 1081,
            wdDialogIMESetDefault: 1094,
            wdDialogTCSCTranslator: 1156,
            wdDialogHorizontalInVertical: 1160,
            wdDialogTwoLinesInOne: 1161,
            wdDialogFormatEncloseCharacters: 1162,
            wdDialogConsistencyChecker: 1121,
            wdDialogToolsOptionsSmartTag: 1395,
            wdDialogFormatStylesCustom: 1248,
            wdDialogCSSLinks: 1261,
            wdDialogInsertWebComponent: 1324,
            wdDialogToolsOptionsEditCopyPaste: 1356,
            wdDialogToolsOptionsSecurity: 1361,
            wdDialogSearch: 1363,
            wdDialogShowRepairs: 1381,
            wdDialogMailMergeInsertAsk: 4047,
            wdDialogMailMergeInsertFillIn: 4048,
            wdDialogMailMergeInsertIf: 4049,
            wdDialogMailMergeInsertNextIf: 4053,
            wdDialogMailMergeInsertSet: 4054,
            wdDialogMailMergeInsertSkipIf: 4055,
            wdDialogMailMergeFieldMapping: 1304,
            wdDialogMailMergeInsertAddressBlock: 1305,
            wdDialogMailMergeInsertGreetingLine: 1306,
            wdDialogMailMergeInsertFields: 1307,
            wdDialogMailMergeRecipients: 1308,
            wdDialogMailMergeFindRecipient: 1326,
            wdDialogMailMergeSetDocumentType: 1339,
            wdDialogLabelOptions: 1367,
            wdDialogXMLElementAttributes: 1460,
            wdDialogSchemaLibrary: 1417,
            wdDialogPermission: 1469,
            wdDialogMyPermission: 1437,
            wdDialogXMLOptions: 1425,
            wdDialogFormattingRestrictions: 1427,
            wdDialogSourceManager: 1920,
            wdDialogCreateSource: 1922,
            wdDialogDocumentInspector: 1482,
            wdDialogStyleManagement: 1948,
            wdDialogInsertSource: 2120,
            wdDialogOMathRecognizedFunctions: 2165,
            wdDialogInsertPlaceholder: 2348,
            wdDialogBuildingBlockOrganizer: 2067,
            wdDialogContentControlProperties: 2394,
            wdDialogCompatibilityChecker: 2439,
            wdDialogExportAsFixedFormat: 2349,
            wdDialogFileNew2007: 1116
        },
        docProperty: {
            msoPropertyNumber: 1,
            msoPropertyBoolean: 2,
            msoPropertyDate: 3,
            msoPropertyString: 4,
            msoPropertyFloat: 5,
        },
        WdSaveFormat: {
            wdFormatDocument: 0,
            wdFormatDocument97: 0,
            wdFormatTemplate: 1,
            wdFormatTemplate97: 1,
            wdFormatText: 2,
            wdFormatTextLineBreaks: 3,
            wdFormatDOSText: 4,
            wdFormatDOSTextLineBreaks: 5,
            wdFormatRTF: 6,
            wdFormatUnicodeText: 7,
            wdFormatEncodedText: 7,
            wdFormatHTML: 8,
            wdFormatWebArchive: 9,
            wdFormatFilteredHTML: 10,
            wdFormatXML: 11,
            wdFormatXMLDocument: 12,
            wdFormatXMLDocumentMacroEnabled: 13,
            wdFormatXMLTemplate: 14,
            wdFormatXMLTemplateMacroEnabled: 15,
            wdFormatDocumentDefault: 16,
            // PDF格式
            wdFormatPDF: 17,
            wdFormatXPS: 18,
            wdFormatFlatXML: 19,
            wdFormatFlatXMLMacroEnabled: 20,
            wdFormatFlatXMLTemplate: 21,
            wdFormatFlatXMLTemplateMacroEnabled: 22,
            wdFormatOpenDocumentText: 23,
            wdFormatStrictOpenXMLDocument: 24,
            // OFD格式
            wdFormatOFD: 102
        },
        WdRelativeHorizontalPosition: {
            // 相对于字符
            wdRelativeHorizontalPositionCharacter: 3,
            // 相对于列
            wdRelativeHorizontalPositionColumn: 2,
            // 相对于边距
            wdRelativeHorizontalPositionMargin: 0,
            // 相对于页面
            wdRelativeHorizontalPositionPage: 1,
            // 相对于内空白区
            wdRelativeHorizontalPositionInnerMarginArea: 6,
            // 相对于左边距
            wdRelativeHorizontalPositionLeftMarginArea: 4,
            // 相对于外空白区
            wdRelativeHorizontalPositionOuterMarginArea: 7,
            // 相对于右边距
            wdRelativeHorizontalPositionRightMarginArea: 5,
        },
        WdProtectionType: {
            wdNoProtection: -1,
            wdAllowOnlyRevisions: 0,
            wdAllowOnlyComments: 1,
            wdAllowOnlyFormFields: 2,
            wdAllowOnlyReading: 3,
        },
        WdHeaderFooterIndex: {
            wdHeaderFooterEvenPages: 3,
            wdHeaderFooterFirstPage: 2,
            wdHeaderFooterPrimary: 1
        },
        WdSectionStart: {
            // “连续”分节符。
            wdSectionContinuous: 0,
            // “偶数页”分节符。
            wdSectionEvenPage: 3,
            // “新栏”分节符。
            wdSectionNewColumn: 1,
            // “新页”分节符。
            wdSectionNewPage: 2,
            // “奇数页”分节符。
            wdSectionOddPage: 4,
        },
        WdShapePosition: {
            // 底部
            wdShapeBottom: -999997,
            // 中央
            wdShapeCenter: -999995,
            // 所选区域内部
            wdShapeInside: -999994,
            // 左侧
            wdShapeLeft: -999998,
            // 所选区域外部
            wdShapeOutside: -999993,
            // 右侧
            wdShapeRight: -999996,
            // 顶部
            wdShapeTop: -999999,
        }
    }
    export default{
        yozoExt,
        createNew
    }
// };