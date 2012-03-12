/**
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		sl=ya.sl,
		regx=ya.regx,
		uihelper=ya.uihelper,
		Solution=sl.Solution;
		
	$.widget('ya.form0',{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			},
			//ajaxOptions:null,	//ajax请求参数，如果为null则进行一般的form请求，默认为null
			/**
			 * items=[{
			 * 	"selector":{selector},	//jquery选择符
			 * 	"vtype":{mix},	//验证类型
			 * 	"errorMsg":{String},	//验证失败提示信息
			 *  "defaultValue":{String|Array},	//默认值
			 * 	"handler":{Function}	//点击后触发
			 * }]
			 */
			items:[]
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				advancedTheme=options.advancedTheme;
			//设置items
			
			self._items();
			self._actions();
			
			//控件高级主题渲染
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.element);
					}		
				}
			}
			
		},
		_items:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				i,
				item;
			var items=[];
			for(i=0;item=options.items[i++];){
				items[i-1]=_.extend({
					"element":$(item.selector,element)
				},item);
			}
			self.items=items;
		},
		_actions:function(){
			var self=this,
				element=self.element,
				options=self.options;
			//handler句柄绑定
			element.on('click',function(e){
				var targetJq=$(e.target),
					item=self.getItem(targetJq);
				if(item&&item.handler){
					item.handler.call(item.element,e);
				}
			});
		},
		vField:function(selector){
			var self=this,
				item=self.getItem(selector),
				v=item.element.val(),
				vtypeFn=uihelper.vtype(self,item.vtype,item);
			if(_.isUndefined(v)){
				v=item.element.data('value');
				if(_.isUndefined(v)){
					v=item.element.attr('val');
				}
			}
			if(_.isUndefined(v)){
				alert('大爷给点值吧');
				return false;
			}
			if(vtypeFn!==false){
				return vtypeFn.call(self,v);
			}
		},
		vForm:function(){
			var self=this,
				noError=true,
				items=self.items;
			_.each(items,function(v){
				if(v.vtype){
					var validV=self.vField(v.selector);
					if(!validV){
						noError=false;
					}
				}
			});
			return noError;
		},
		reset:function(){
			var self=this,
				element=self.element,
				items=self.items;
			_.each(items,function(v){
				var itemJq=v.element,
					defaultValue;
				if(v.defaultValue){
					defaultValue=[].concat(v.defaultValue);
					if(itemJq.is(':text')){
						itemJq.val(defaultValue[0]);
					}else if(itemJq.is(':radio,:checkbox')){
						itemJq.each(function(){
							var thisJq=$(this);
							if(_.include(defaultValue,thisJq.val())){
								thisJq.attr('checked',true);
							}
						});
					}else if(itemJq.is('textarea')){
						itemJq.val(defaultValue[0]).text(defaultValue[0]);
					}else if(itemJq.is('select')){
						$('option',itemJq).each(function(i){
							var thisJq=$(this);
							if(_.include(defaultValue,thisJq.val())){
								thisJq.attr('selected',true);
							}
						});
					}else{
						//普通dom
						itemJq.text(defaultValue[0]).data('value',defaultValue[0]);
					}
				}
			});
		},
		addItem:function(items){
			var self=this,
				element=self.element;
			items=_.map([].concat(items),function(v){
				return v.element=$(item.selector,element);
			});
			self.items=self.items.concat(items);
		},
		/**
		 * 推荐用注册selector筛选效率高
		 */
		getItem:function(selector){
			var self=this,
				items=self.items;
			return _.find(items,function(v){
				if(_.isString(selector)&&v.selector==selector){
					return v;
				}else if($(selector).get(0)===v.element.get(0)){
					return v;
				}
			});
		}
		
	});
}(jQuery,this));