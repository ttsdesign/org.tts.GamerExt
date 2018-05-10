(function (factory) {factory(jQuery)}(function ($) {

function ExtensionHelper (name, options) {
	var defaults = {Name: name, Template: "#lodash__"+name, Storage: {Name: name, Type: "object"}};
	$.extend(this, defaults, options);

	return this;
}

ExtensionHelper.prototype.All = function () {
	return localStorage[this.Storage.Name] && typeof JSON.parse(localStorage[this.Storage.Name]) === this.Storage.Type ? JSON.parse(localStorage[this.Storage.Name]) : (this.Storage.Type === 'object') ? {} : [];
};

ExtensionHelper.prototype.Active = function () {
	return _.filter($[this.Name].All(), ['active', 'true']);
};

ExtensionHelper.prototype.Save = function (form) {
        var page_url = $(form).find('#addPageUrl').val();

        if (page_url.length === 0) {
            return false;
        }

        if (typeof localStorage['pages'] === 'undefined' || typeof window.pages.all() !== 'object') {
            localStorage['pages'] = '';
        }

        localStorage['pages'] = JSON.stringify(
            window.pages.all().concat([{
                page_url: page_url,
                active: 'true'
            }])
        );
		chrome.storage.sync.set({pages: localStorage['pages']});
    };

    ExtensionHelper.prototype.drop = function (key) {
        if (key > -1) {
            var pages = window.pages.all();
            pages.splice(key, 1);
            localStorage['pages'] = JSON.stringify(pages);
			chrome.storage.sync.set({pages: localStorage['pages']});
        }
    };

    ExtensionHelper.prototype.update = function (index, key, value) {
        var pages = window.pages.all();

        var update = {};
        update[key] = value;

        pages.splice(index, 1, _.merge(pages[index], update));

        localStorage['pages'] = JSON.stringify(pages);
		chrome.storage.sync.set({pages: localStorage['pages']});

    };

    ExtensionHelper.prototype.render = function () {
        return _.template(
            $(window.pages.template).html()
        )({pages: window.pages.all()});
    };

    this.draw = function () {
        $('.pages').html(
            window.pages.render()
        );
    };

    this.init = function () {
        $(document).on('submit', '[data-add-page]', function (e) {
            e.preventDefault();

            window.pages.save(this);
            window.pages.draw();

            $('#addPage').modal('hide');

            return false;
        });

        $(document).on('submit', '[data-edit-page]', function (e) {
            e.preventDefault();

            var index = $(this).data('edit-page');

            window.pages.update(index, 'page_url', $(this).find('[name="page"]').val());

            var modal = $('#editPage_' + index);
            modal.modal('hide');
            modal.one('hidden.bs.modal', function () {
                window.pages.draw();
            });

            return false;
        });

        $(document).on('click', '[data-page-drop]', function (e) {
            e.preventDefault();

            if (window.confirm("Are you sure to delete page?")) {
                window.pages.drop(
                    $(this).data('page-drop')
                );
                window.pages.draw();
            }

            return true;
        });

        $(document).on('change', '[data-page-active]', function (e) {
            e.preventDefault();

            var key = $(this).data('page-active');
            var value = $(this).val();

            window.pages.update(key, 'active', value);

            return false;
        });
    };

}

window.pages = new Pages();

chrome.storage.onChanged.addListener(function(changes, namespace) {
	if ('pages' in changes) {
		localStorage['pages'] = changes['pages'].newValue;
		window.pages = new Pages();
		if (location.href.startsWith('chrome-extension') && location.href.endsWith('options.html')) {
			window.location.reload();
		}
	}
});
*/
