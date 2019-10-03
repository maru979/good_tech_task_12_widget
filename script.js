define(['jquery'], function($){

	async function leadsHighlightAll() {
		const resolve = await getPromise();
		var ids = getIds(resolve);
		leadsHilightById(ids);
	}

	function getPromise(){
		return Promise.resolve($.ajax({type: 'GET', url: 'https://meyop.amocrm.ru/api/v2/leads'}));
	}

	function getIds(resolve){
		var leadsData = _.map(resolve._embedded.items, function (item) {return {id: item.id, sale: item.sale,};});
		var ids = [];
		for (i in leadsData){
			if(leadsData[i].sale > 10000){
				ids.push(leadsData[i].id);
			}
		}
		return ids;
	}

	function leadsHilightById(ids){
		if (AMOCRM.data.is_card === false) {
			switch(AMOCRM.data.current_entity)
			{
				case 'leads':{
					$(".list__table").addClass("custom_table");
					for (i in ids) {
						$("#list_item_" + ids[i]).find(".list-row__cell-id").addClass("highlight_row_left");
						$("#list_item_" + ids[i]).find(".list-row__cell-name").addClass("highlight_row_middle");
						$("#list_item_" + ids[i]).find(".list-row__cell-main_contact").addClass("highlight_row_middle");
						$("#list_item_" + ids[i]).find(".list-row__cell-contact_company_name").addClass("highlight_row_middle");
						$("#list_item_" + ids[i]).find(".list-row__cell-status").addClass("highlight_row_middle");
						$("#list_item_" + ids[i]).find(".list-row__cell-budget").addClass("highlight_row_right");
						console.log("highlited lead with id: " + ids[i]);
					}
					break;
				}
				case 'leads-pipeline':{
					for (i in ids) {
						if($(`#pipeline_item_${ids[i]}`).not(".pipeline_highlight").length > 0) {
							$(`#pipeline_item_${ids[i]}`).addClass("pipeline_highlight");
							console.log(`highlited lead with id: ${ids[i]}`);
						}
					}
					break;
				}
			}
			console.log('colors changed');
		}
	}

    var CustomWidget = function () {

        $('.pipeline-scroller').on('DOMSubtreeModified', '.pipeline_items__list', function() {
			leadsHighlightAll();
            console.log('.pipeline_items__list changed');
        });

    	var self = this;
    	console.log(self);

		this.callbacks = {
			render: function(){
				console.log('render');
				return true;
			},
			init: function(){
                var settings = self.get_settings();
				if ($('link[href="' + settings.path + '/style.css?v=' + settings.version +'"').length < 1) {
					$("head").append('<link href="' + settings.path + '/style.css?v=' + settings.version + '" type="text/css" rel="stylesheet">');
				}
				console.log('init');
                leadsHighlightAll();
				return true;
			},
			bind_actions: function(){
				console.log('bind_actions');
				return true;
			},
			settings: function(){
				return true;
			},
			onSave: function(){
				alert('click');
				return true;
			},
			destroy: function(){
				
			},
			contacts: {
					//select contacts in list and clicked on widget name
					selected: function(){
						console.log('contacts');
					}
				},
			leads: {
					//select leads in list and clicked on widget name
					selected: function(){
						console.log('leads');
					}
				},
			tasks: {
					//select taks in list and clicked on widget name
					selected: function(){
						console.log('tasks');
					}
				}
		};
		return this;
    };

return CustomWidget;
});