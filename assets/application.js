$(document).ready(function(){

	let
		onQuantityButtonClick = function(event) {
		//alert('button clicked');
		let
			$button = $(this), //gets the js-quantity button 
			$form = $button.closest('form'),
			$quantity = $form.find('.js-quantity-field'),
			quantityValue = parseInt($quantity.val()),
			max = $quantity.attr('max') ? parseInt($quantity.attr('max')) : null; 

		if ($button.hasClass('plus') && (max === null || quantityValue+1 <= max)) {
			//do something
			$quantity.val(quantityValue + 1).change(); //must write change to trigger the buttons 
		}
		else if ($button.hasClass('minus')) {
			//do something here 
			$quantity.val(quantityValue - 1).change(); // must write change to trigger minus button 
		}
	},

	onQuantityFieldChange = function(event){
		let
			$field = $(this),
			$form = $field.closest('form'),
			$quantityText = $form.find('.js-quantity-text'),
			shouldDisableMinus = parseInt(this.value) === 1,
			shouldDisablePlus = parseInt (this.value) === parseInt($field.attr('max')),
			$minusButton = $form.find('.js-quantity-button.minus');
			$plusButton = $form.find('.js-quantity-button.plus');

			$quantityText.text(this.value);

			if (shouldDisableMinus) {
				$minusButton.prop('disabled', true);
			}
			else if ($minusButton.prop('disabled') == true) { //another if statement to only disable minus if at 1 otherwise enabled
				$minusButton.prop('disabled', false);
			}

			if (shouldDisablePlus) {
				$plusButton.prop('disabled', true);
			}
			else if ($plusButton.prop('disabled') == true) { //another if statement to only disable minus if at 1 otherwise enabled
				$plusButton.prop('disabled', false);
			}
	},

	onVariantRadioChange = function(event){
		let
			$radio = $(this),
			$form = $radio.closest('form'),
			max = $radio.attr('data-inventory-quantity'),
			$quantity = $form.find('.js-quantity-field'),
			$addToCartButton = $form.find('#add-to-cart-button');

		if ($addToCartButton.prop('disabled') === true) {
			$addToCartButton.prop('disabled', false);
		}

			$quantity.attr('max', max);

		if (parseInt($quantity.val()) > max) { //this sets it so if quantity is checked before clicking that its not posisble to have greater quantity than what is avail
			$quantity.val(max).change();
		}
	},

	onAddToCart = function(event) {
		event.preventDefault();

		$.ajax({
			type:'POST',
			url: '/cart/add.js',
			data: $(this).serialize(),
			dataType: 'json', 
			success: onCartUpdated,
			error: onError
		});
	},
	onLineRemoved = function(event) {
		event.preventDefault();
		let
			$removeLink = $(this),
			removeQuery = $removeLink.attr('href').split('change?')[1]; 
		$.post('/cart/change.js', removeQuery, onCartUpdated, 'json');
	}
	onCartUpdated = function() {
		$.ajax({
			type: 'GET',
			url: '/cart',
			context: document.body,
			success: function(context) {
				let 
					$dataCartContents = $(context).find('.js-cart-page-contents'),
					dataCartHtml = $dataCartContents.html(), //this is turning it into a string that we can output elsewhere
					dataCartItemCount = $dataCartContents.attr('data-cart-item-count'),
					$miniCartContents = $('.js-mini-cart-contents'),
					$cartItemCount = $('.js-cart-item-count');

				$cartItemCount.text(dataCartItemCount);
				$miniCartContents.html(dataCartHtml);

				if (parseInt(dataCartItemCount) > 0) {
					openCart();
				}
				else {
					closeCart();
				}
			}
		});
	},
	onError = function(XMLHttpRequest, textStatus) {
		let data = XMLHttpRequest.responseJSON;
		alert(data.status + ' - ' + data.message + ':  ' + data.description);
	},
	openCart = function() {
		$('html').addClass('mini-cart-open');
	},
	closeCart = function() {
		$('html').removeClass('mini-cart-open');
	},
	onCartButtonClick = function(event) {
		event.preventDefault();

		let
			isCartOpen = $('html').hasClass('mini-cart-open');

		if (!isCartOpen) {
			openCart();
		}
		else {
			closeCart();
		}
	};



	$(document).on('click', '.js-quantity-button', onQuantityButtonClick);

	$(document).on('change', '.js-quantity-field', onQuantityFieldChange);

	$(document).on('change', '.js-variant-radio', onVariantRadioChange);

	$(document).on('submit', '#add-to-cart-form', onAddToCart);

	$(document).on('click', '#mini-cart .js-remove-line', onLineRemoved);

	$(document).on('click', '.js-cart-link, #mini-cart .js-keep-shopping', onCartButtonClick);

});