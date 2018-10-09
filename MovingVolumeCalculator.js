/** MovingVolumeCalculator Class used to handle the MovingVolumeCalculator module */
class MovingVolumeCalculator{ //eslint-disable-line no-unused-vars
	/**
     * Creates an instance of MovingVolumeCalculator
     * and checks for invalid parameters
     * @param {(Element|String)} target                   The wrapper for the MovingVolumeCalculator module
     * @param {Object}           [parameters]             Additional optional parameters
     * @param {String}           [parameters.lang=en]     The lang to use
     */
    constructor(target, parameters){
        /** 
		 * The element in which the module will be placed
		 * @private 
		 */
        this._wrapper = target instanceof Element ? target : document.querySelector(target);

        //Errors checking
        if(!this._wrapper) throw new Error('MovingVolumeCalculator: '+(typeof target == 'string' ? 'The selector `'+target+'` didn\'t match any element.' : 'The element you provided was undefined'));
        if(this._wrapper.classList.contains('mvc-wrapper')) throw new Error('MovingVolumeCalculator: The element has already been initialized.');

        /** @private */
        this._parameters = parameters || {};

        /** 
		 * The estimated volume
		 * @type {Number} 
		 */
        this.volume = 0;

        if(!this._parameters.lang) this._parameters.lang = 'en';

		this._createDictionary();
        this._build();
        this._listen();
	}

	/**
     * Creates the dictionary
     * @private
     */
    _createDictionary(){
		this._dictionary = {
			en: {
				volume: 'Volume (m3)',
				surfaceOptionEnable: 'I don\'t know my volume / I\'d rather fill out my surface',
				surfaceOptionDisable: 'I\'d rather fill out my volume',
				wrongVolume: 'The volume isn\'t a valid number',
				surface: 'Surface (m2)',
				wrongSurface: 'The surface isn\'t a valid number'
			},
			fr: {
				volume: 'Volume (m3)',
				surfaceOptionEnable: 'Je ne connais pas mon volume / Je préfère renseigner ma surface',
				surfaceOptionDisable: 'Je préfère renseigner mon volume',
				wrongVolume: 'Le volume n\'est pas un nombre valide',
				surface: 'Surface (m2)',
				wrongSurface: 'The surface isn\'t a valid number'
			}
		};
	}
	
	/**
     * Builds the MovingVolumeCalculator DOM Tree inside the element
     * @private
     */
    _build(){
		this._wrapper.classList.add('mvc-wrapper');

		/*
		 *	Volume Input
		 */
		let line = document.createElement('p');

		this._wrapper.appendChild(line);

		this._volumeInput = document.createElement('input');
		this._volumeInput.classList.add('mvc-volume-input');
		this._volumeInput.placeholder = this._dictionary[this._parameters.lang].volume;
		line.appendChild(this._volumeInput);

		/*
		 *	Surface toggler
		 */
		line = document.createElement('p');
		line.classList.add('mvc-surface-toggler');
		this._wrapper.appendChild(line);

		this._surfaceOption = document.createElement('a');
		this._surfaceOption.classList.add('mvc-surface-enable');
		this._surfaceOption.innerText = this._dictionary[this._parameters.lang].surfaceOptionEnable;
		this._surfaceOption.href = '';
		line.appendChild(this._surfaceOption);

		/*
		 *	Surface Input
		 */
		line = document.createElement('p');
		line.classList.add('mvc-hidden');
		this._wrapper.appendChild(line);

		this._surfaceInput = document.createElement('input');
		this._surfaceInput.classList.add('mvc-surface-input');
		this._surfaceInput.placeholder = this._dictionary[this._parameters.lang].surface;
		line.appendChild(this._surfaceInput);
	}

	/**
     * Creates event listeners
     * @private
     */
    _listen(){
		// Volume input handler
		this._volumeInput.addEventListener('input', () => {
			if((/^\d+([.,]\d{0,2})?$/u).test(this._volumeInput.value)){
				this._clearHints(this._volumeInput);
				this.volume = +this._volumeInput.value.replace(',', '.');
			}else{
				this._addHint(this._volumeInput, 'error', this._dictionary[this._parameters.lang].wrongVolume);
			}
		});

		// Surface toggler handler
		this._surfaceOption.addEventListener('click', e => {
			e.preventDefault();
			
			if(this._surfaceOption.classList.contains('mvc-surface-enable')){
				this._surfaceOption.classList.remove('mvc-surface-enable');
				this._surfaceOption.classList.add('mvc-surface-disable');
				this._surfaceOption.innerText = this._dictionary[this._parameters.lang].surfaceOptionDisable;

				this._volumeInput.disabled = true;

				this._surfaceInput.parentElement.classList.remove('mvc-hidden');
			}else{
				this._surfaceOption.classList.remove('mvc-surface-disable');
				this._surfaceOption.classList.add('mvc-surface-enable');
				this._surfaceOption.innerText = this._dictionary[this._parameters.lang].surfaceOptionEnable;

				this._volumeInput.disabled = false;

				this._surfaceInput.parentElement.classList.add('mvc-hidden');
			}
		});

		// Surface input handler
		this._surfaceInput.addEventListener('input', () => {
			if((/^\d+([.,]\d{0,2})?$/u).test(this._surfaceInput.value)){
				this._clearHints(this._surfaceInput);

				const volume = MovingVolumeCalculator.fromSurface(+this._surfaceInput.value.replace(',', '.'));

				this.volume = volume;
				this._volumeInput.value = volume;
			}else{
				this._addHint(this._surfaceInput, 'error', this._dictionary[this._parameters.lang].wrongSurface);
			}
		});
	}

	/**
     * Displays a hint for the given element
	 * @param {Element} target   The element to display the hint above
	 * @param {String}  type     The type of hint to display
	 * @param {String}  text     The hint's text
     * @private
     */
    _addHint(target, type, text){
		const 	parent = target.parentNode,
				hint = document.createElement('span');

		let icon = '';

		switch (type) {
			case 'error':
				icon = '\u26A0';
				break;
			default:

				break;
		}

		hint.innerText = icon + ' ' + text;
		hint.classList.add('mvc-hint', type);

		if(target.previousElementSibling && target.previousElementSibling.classList.contains('mvc-hint')) target.previousElementSibling.remove();

		parent.insertBefore(hint, target);
	}

	/**
     * Clears the hints for the given element
	 * @param {Element} target   The element that should be cleared of hints
     * @private
     */
    _clearHints(target){
		if(target.previousElementSibling && target.previousElementSibling.classList.contains('mvc-hint')) target.previousElementSibling.remove();
	}

	/**
     * Removes any MovingVolumeCalculator mutation from the DOM
     */
    destroy(){

	}

	/**
     * Calculates a volume from a surface
	 * @param {Number} surface The surface to calculate from
	 * @returns {Number} The 2-decimal rounded volume
	 * @static
     */
    static fromSurface(surface){
		return Math.round(0.45 * surface * 100) / 100;
	}

	/**
     * Removes any MovingVolumeCalculator mutation from the DOM
     * @param {String} selector The MovingVolumeCalculator wrapper selector
     * @static
     */
    static destroy(selector){
		const element = document.querySelector(selector);

		if(element) element.remove();
	}
}