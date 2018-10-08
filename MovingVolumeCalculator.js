/** MovingVolumeCalculator Class used to handle the MovingVolumeCalculator module */
class MovingVolumeCalculator{
	/**
     * Creates an instance of MovingVolumeCalculator
     * and checks for invalid parameters
     * @param {(Element|String)} target                   The wrapper for the MovingVolumeCalculator module
     * @param {Object}           [parameters]             Additional optional parameters
     * @param {String}           [parameters.lang=en]             Additional optional parameters
     */
    constructor(target, parameters){
        /** @private */
        this._wrapper = target instanceof Element ? target : document.querySelector(target);

        //Errors checking
        if(!this._wrapper) throw new Error('MovingVolumeCalculator: '+(typeof target == 'string' ? 'The selector `'+target+'` didn\'t match any element.' : 'The element you provided was undefined'));
        if(this._wrapper.classList.contains('moving-volume-calculator-wrapper')) throw new Error('MovingVolumeCalculator: The element has already been initialized.');

        /** @private */
        this._parameters = parameters || {};

        /** @type {Number} The estimated volume */
        this.volume = 0;

        if(!this._parameters.lang) this._parameters.lang = 'en';


        this._build();
        this._listen();
	}
	
	/**
     * Builds the MovingVolumeCalculator DOM Tree inside the element
     * @private
     */
    _build(){

	}

	/**
     * Creates event listeners
     * @private
     */
    _listen(){

	}

	/**
     * Removes any MovingVolumeCalculator mutation from the DOM
     */
    destroy(){

	}

	/**
     * Removes any MovingVolumeCalculator mutation from the DOM
     * @param {String} selector The MovingVolumeCalculator wrapper selector
     * @static
     */
    static destroy(selector){

	}
}