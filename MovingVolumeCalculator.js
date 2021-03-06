/**
 * Room details
 * @typedef Room
 * @type {Object}
 * @property {String} icon URL or HTML of the room's icon
 * @property {Object.<String, String>} lang Object storing room's translation in mulitple languages
 * @property {Number} surface The room's average surface
 * @property {Number} ratio The room's average surface to volume ratio
 * @memberof MovingVolumeCalculator
 * @example
 * {
 *   icon: 'https://your.icon',
 *   lang: {
 *     en: 'Kitchen',
 *     fr: 'Cuisine'
 *   },
 *   surface: 14,
 *   ratio: 0.45
 * }
 */

/**
 * Rooms object list
 * @typedef Rooms
 * @type {Object.<String, MovingVolumeCalculator.Room>}
 * @memberof MovingVolumeCalculator
 * @example
 * {
 *   kitchen: {
 *     icon: 'https://your.icon',
 *     lang: {
 *       en: 'Kitchen',
 *       fr: 'Cuisine'
 *     },
 *     surface: 14,
 *     ratio: 0.45
 *   }, ...
 * }
 */

/**
 * Translations object
 * @typedef Lang
 * @type {Object.<String, String>}
 * @memberof MovingVolumeCalculator
 * @example
 * {
 *   roomsOptionEnable: 'I prefer filling out my rooms\' details',
 *   roomsOptionDisable: 'I\'d rather fill out my surface'
 * }
 */

/**
 * Translations object list
 * @typedef Dictionary
 * @type {Object.<String, MovingVolumeCalculator.Lang>}
 * @memberof MovingVolumeCalculator
 * @example
 * {
 *   en: {
 *     roomsOptionEnable: 'I prefer filling out my rooms\' details',
 *     roomsOptionDisable: 'I\'d rather fill out my surface'
 *   },
 *   fr: {
 *     roomsOptionEnable: 'Je préfère renseigner le détail de mes pièces',
 *     roomsOptionDisable: 'Je préfère renseigner ma surface'
 *   }
 * }
 */

/** MovingVolumeCalculator Class used to handle the MovingVolumeCalculator module */
class MovingVolumeCalculator{ //eslint-disable-line no-unused-vars

	/**
     * Creates an instance of MovingVolumeCalculator
     * and checks for invalid parameters
	 * @param {(Element|String)} 					target                   				The wrapper for the MovingVolumeCalculator module
     * @param {Object}           					[parameters]            				Additional optional parameters
     * @param {String}           					[parameters.lang=en]     				The lang to use
     * @param {Number}           					[parameters.surfaceToVolumeRatio=0.45]  Average surface to volume ratio
     * @param {Boolean}           					[parameters.stylised=true]  			Use the stylised version of the Calculator
	 * @param {MovingVolumeCalculator.Rooms}    	[parameters.rooms]       				Sets custom rooms to display
	 * @param {MovingVolumeCalculator.Dictionary}   [parameters.dictionary]  				Adds custom translations to the dictionary
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
		this._parameters = {
			lang: 'en',
			surfaceToVolumeRatio: 0.45,
			stylised: true,
			...parameters
		};

		/** 
		 * List of callbacks to call after a validation
		 * @private 
		 */
		this._onValidate = [];

		/** 
		 * List of callbacks to call after a volume change
		 * @private 
		 */
		this._onChange = [];

		/** 
		 * The available informations
		 * @type {Object} 
		 */
		this.data = {
			volume: 0,
			surface: 0,
			rooms: {}
		};

		/** 
		 * The average surface to volume ratio
		 * @type {Number} 
		 */
		this.surfaceToVolumeRatio = this._parameters.surfaceToVolumeRatio;

        /** 
		 * The estimated volume
		 * @type {Number} 
		 */
        this.volume = 0;

		this._loadRooms();
		this._loadDictionary();

		this._build();
		this.updateData();

        this._listen();
	}

	/**
     * Loads the rooms info
     * @private
     */
    _loadRooms(){
		/** @private */
		this._rooms = {
			kitchen: {
				icon: '<svg height="480pt" viewBox="0 0 480 480.00012" width="480pt" xmlns="http://www.w3.org/2000/svg"><path d="m472 240h-152v-16c0-4.417969-3.582031-8-8-8h-144c-4.417969 0-8 3.582031-8 8v16h-152c-4.417969 0-8 3.582031-8 8v32c0 4.417969 3.582031 8 8 8h16v184c0 4.417969 3.582031 8 8 8h416c4.417969 0 8-3.582031 8-8v-184h16c4.417969 0 8-3.582031 8-8v-32c0-4.417969-3.582031-8-8-8zm-296-8h128v8h-128zm-136 56h32v176h-32zm48 0h48v176h-48zm64 0h176v176h-176zm288 176h-96v-80h96zm0-96h-96v-80h96zm24-96h-448v-16h448zm0 0"/><path d="m312 352h-144c-4.417969 0-8 3.582031-8 8v88c0 4.417969 3.582031 8 8 8h144c4.417969 0 8-3.582031 8-8v-88c0-4.417969-3.582031-8-8-8zm-8 88h-128v-72h128zm0 0"/><path d="m288 344c13.253906 0 24-10.746094 24-24s-10.746094-24-24-24-24 10.746094-24 24 10.746094 24 24 24zm0-32c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8-8-3.582031-8-8 3.582031-8 8-8zm0 0"/><path d="m192 344c13.253906 0 24-10.746094 24-24s-10.746094-24-24-24-24 10.746094-24 24 10.746094 24 24 24zm0-32c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8-8-3.582031-8-8 3.582031-8 8-8zm0 0"/><path d="m224 392h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8zm0 0"/><path d="m376 336h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8zm0 0"/><path d="m376 432h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8zm0 0"/><path d="m56 352c-4.417969 0-8 3.582031-8 8v32c0 4.417969 3.582031 8 8 8s8-3.582031 8-8v-32c0-4.417969-3.582031-8-8-8zm0 0"/><path d="m112 352c-4.417969 0-8 3.582031-8 8v32c0 4.417969 3.582031 8 8 8s8-3.582031 8-8v-32c0-4.417969-3.582031-8-8-8zm0 0"/><path d="m64 64h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8zm0 0"/><path d="m472 0h-144c-4.417969 0-8 3.582031-8 8v62.113281l-32.800781-65.6875c-1.359375-2.726562-4.152344-4.441406-7.199219-4.425781h-80c-3.03125 0-5.804688 1.710938-7.160156 4.425781l-32.839844 65.6875v-62.113281c0-4.417969-3.582031-8-8-8h-144c-4.417969 0-8 3.582031-8 8v72c0 4.417969 3.582031 8 8 8h144v24c0 4.417969 3.582031 8 8 8h160c4.417969 0 8-3.582031 8-8v-24h144c4.417969 0 8-3.582031 8-8v-72c0-4.417969-3.582031-8-8-8zm-328 72h-128v-56h128zm60.945312-56h70.109376l32 64h-134.109376zm107.054688 88h-144v-8h144zm152-32h-128v-56h128zm0 0"/><path d="m384 64h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8zm0 0"/></svg>',
				lang: {
					en: 'Kitchen',
					fr: 'Cuisine'
				},
				surface: 14,
				ratio: 0.45
			},
			livingRoom: {
				icon: '<svg height="480pt" viewBox="-28 0 480 480" width="480pt" xmlns="http://www.w3.org/2000/svg"><path d="m414.636719 289.382812c-4.042969-4.011718-9.089844-6.859374-14.617188-8.246093v-41.136719c-.027343-22.082031-17.917969-39.972656-40-40h-144c-22.078125.027344-39.972656 17.917969-40 40v41.136719c-14.085937 3.636719-23.945312 16.316406-24 30.863281v136c0 4.417969 3.582031 8 8 8h8v16c0 4.417969 3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8v-16h8c4.417969 0 8-3.582031 8-8v-24h144v24c0 4.417969 3.582031 8 8 8h8v16c0 4.417969 3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8v-16h8c4.417969 0 8-3.582031 8-8v-136c.015625-8.488281-3.363281-16.632812-9.382812-22.617188zm-222.617188 118.617188v-40h192v40zm0-168c0-13.253906 10.746094-24 24-24h144c13.253907 0 24 10.746094 24 24v112h-192zm8 200h-32v-128c.019531-5.691406 3.066407-10.941406 8-13.777344v117.777344c0 4.417969 3.582031 8 8 8h16zm208 0h-32v-16h16c4.417969 0 8-3.582031 8-8v-117.777344c4.984375 2.789063 8.050781 8.070313 8 13.777344zm0 0"/><path d="m81.125 0h-50.207031c-12.574219.0390625-23.003907 9.75-23.9375 22.289062l-6.9609378 97.144532c-.1562502 2.214844.6171878 4.402344 2.1328128 6.027344 1.519531 1.625 3.644531 2.542968 5.867187 2.539062h40v312h-24c-3.445312 0-6.503906 2.203125-7.589843 5.472656l-8 24c-.8125 2.4375-.40625 5.121094 1.101562 7.207032 1.503906 2.085937 3.917969 3.320312 6.488281 3.320312h80c2.570313 0 4.988281-1.234375 6.492188-3.320312 1.503906-2.085938 1.914062-4.769532 1.101562-7.207032l-8-24c-1.089843-3.269531-4.148437-5.472656-7.59375-5.472656h-24v-312h40c2.222657.003906 4.351563-.914062 5.867188-2.539062 1.519531-1.625 2.292969-3.8125 2.132812-6.027344l-6.960937-97.144532c-.933594-12.539062-11.359375-22.2499995-23.933594-22.289062zm3.800781 464h-57.808593l2.671874-8h52.464844zm-68.3125-352 6.328125-88.566406c.296875-4.195313 3.792969-7.445313 8-7.433594h50.207032c4.207031-.011719 7.699218 3.238281 8 7.433594l6.28125 88.566406zm0 0"/><path d="m176.019531 168h224c4.417969 0 8-3.582031 8-8v-120c0-4.417969-3.582031-8-8-8h-224c-4.417969 0-8 3.582031-8 8v120c0 4.417969 3.582031 8 8 8zm8-120h208v104h-208zm0 0"/><path d="m365.675781 58.34375c-3.136719-3.03125-8.128906-2.988281-11.214843.097656-3.085938 3.085938-3.128907 8.074219-.097657 11.214844l16 16c3.140625 3.03125 8.128907 2.988281 11.214844-.097656 3.085937-3.085938 3.128906-8.074219.097656-11.214844zm0 0"/><path d="m341.675781 66.34375c-3.136719-3.03125-8.128906-2.988281-11.214843.097656-3.085938 3.085938-3.128907 8.074219-.097657 11.214844l32 32c3.140625 3.03125 8.128907 2.988281 11.214844-.097656 3.085937-3.085938 3.128906-8.074219.097656-11.214844zm0 0"/></svg>',
				lang: {
					en: 'Living Room',
					fr: 'Salon'
				},
				surface: 18,
				ratio: 0.5
			},
			bedroom: {
				icon: '<svg height="480pt" viewBox="0 -63 480 479" width="480pt" xmlns="http://www.w3.org/2000/svg"><path d="m472 248.5h-464c-4.417969 0-8 3.582031-8 8v24c0 4.417969 3.582031 8 8 8h8v56c0 4.417969 3.582031 8 8 8h32c4.417969 0 8-3.582031 8-8v-56h352v56c0 4.417969 3.582031 8 8 8h32c4.417969 0 8-3.582031 8-8v-56h8c4.417969 0 8-3.582031 8-8v-24c0-4.417969-3.582031-8-8-8zm-424 88h-16v-48h16zm400 0h-16v-48h16zm16-64h-448v-8h448zm0 0"/><path d="m480 147.859375c-.015625-1.164063-.289062-2.3125-.800781-3.359375-3.828125-18.613281-20.199219-31.976562-39.199219-32h-1.472656c.949218-2.5625 1.445312-5.269531 1.472656-8v-80c0-13.253906-10.746094-24-24-24h-352c-13.253906 0-24 10.746094-24 24v80c.027344 2.730469.523438 5.4375 1.472656 8h-1.472656c-19 .023438-35.371094 13.386719-39.199219 32-.515625 1.054688-.7890622 2.210938-.800781 3.382812.0507812.527344.15625 1.046876.3125 1.554688-.082031 1.007812-.3125 2.007812-.3125 3.0625v80c0 4.417969 3.582031 8 8 8h464c4.417969 0 8-3.582031 8-8v-80c0-1.054688-.230469-2.054688-.3125-3.089844.15625-.503906.261719-1.023437.3125-1.550781zm-424-43.359375v-80c0-4.417969 3.582031-8 8-8h352c4.417969 0 8 3.582031 8 8v80c0 4.417969-3.582031 8-8 8h-24v-40c0-13.253906-10.746094-24-24-24h-80c-13.253906 0-24 10.746094-24 24v40h-48v-40c0-13.253906-10.746094-24-24-24h-80c-13.253906 0-24 10.746094-24 24v40h-24c-4.417969 0-8-3.582031-8-8zm320 8h-96v-40c0-4.417969 3.582031-8 8-8h80c4.417969 0 8 3.582031 8 8zm-176 0h-96v-40c0-4.417969 3.582031-8 8-8h80c4.417969 0 8 3.582031 8 8zm-160 16h400c8.621094.015625 16.570312 4.667969 20.800781 12.183594-5.144531.851562-10.164062 2.324218-14.953125 4.382812-12.960937 5.429688-27.558594 5.429688-40.519531 0-16.765625-6.941406-35.601563-6.941406-52.367187 0-12.9375 5.425782-27.511719 5.425782-40.449219 0-16.753907-6.953125-35.589844-6.953125-52.34375 0-12.941407 5.425782-27.519531 5.425782-40.464844 0-8.234375-3.621094-17.164063-5.398437-26.160156-5.207031-9-.195313-17.929688 1.585937-26.167969 5.214844-6.347656 2.863281-13.261719 4.25-20.222656 4.066406-6.964844.183594-13.878906-1.203125-20.230469-4.066406-8.234375-3.628907-17.164063-5.410157-26.160156-5.214844-9-.195313-17.933594 1.585937-26.167969 5.214844-6.339844 2.867187-13.246094 4.257812-20.203125 4.066406-6.953125.1875-13.859375-1.203125-20.199219-4.066406-4.796875-2.070313-9.832031-3.542969-14.992187-4.382813 4.230469-7.515625 12.175781-12.171875 20.800781-12.191406zm-24 96v-68.121094c4.203125.636719 8.300781 1.832032 12.191406 3.546875 8.234375 3.628907 17.164063 5.410157 26.160156 5.214844 8.996094.195313 17.921876-1.585937 26.152344-5.214844 6.347656-2.863281 13.257813-4.253906 20.214844-4.066406 6.960938-.183594 13.875 1.203125 20.226562 4.066406 8.234376 3.628907 17.167969 5.410157 26.167969 5.214844 8.996094.195313 17.925781-1.585937 26.160157-5.214844 6.351562-2.863281 13.265624-4.25 20.230468-4.066406 6.960938-.183594 13.875 1.207031 20.222656 4.066406 8.238282 3.628907 17.171876 5.410157 26.167969 5.214844 9 .191406 17.929688-1.585937 26.167969-5.207031 12.941406-5.429688 27.519531-5.429688 40.457031 0 16.753907 6.949218 35.582031 6.949218 52.335938 0 12.953125-5.425782 27.542969-5.425782 40.496093 0 16.773438 6.941406 35.617188 6.941406 52.390626 0 3.910156-1.722656 8.03125-2.917969 12.257812-3.554688v68.121094zm0 0"/></svg>',
				lang: {
					en: 'Bedroom',
					fr: 'Chambre'
				},
				surface: 12,
				ratio: 0.3
			},
			storageRoom: {
				icon: '<svg height="480pt" viewBox="-31 0 479 480" width="480pt" xmlns="http://www.w3.org/2000/svg"><path d="m408.5 0h-400c-4.417969 0-8 3.582031-8 8v464c0 4.417969 3.582031 8 8 8h400c4.417969 0 8-3.582031 8-8v-464c0-4.417969-3.582031-8-8-8zm-8 464h-384v-448h384zm0 0"/><path d="m32.5 456h352c4.417969 0 8-3.582031 8-8v-416c0-4.417969-3.582031-8-8-8h-352c-4.417969 0-8 3.582031-8 8v416c0 4.417969 3.582031 8 8 8zm32-336v-40c0-4.417969 3.582031-8 8-8h64c4.417969 0 8 3.582031 8 8v40zm92 14.777344c1.199219.761718 2.582031 1.1875 4 1.222656h-8c1.417969-.035156 2.800781-.460938 4-1.222656zm12-14.777344v-40c0-4.417969 3.582031-8 8-8h64c4.417969 0 8 3.582031 8 8v40zm92 14.777344c1.199219.761718 2.582031 1.1875 4 1.222656h-8c1.417969-.035156 2.800781-.460938 4-1.222656zm12-14.777344v-40c0-4.417969 3.582031-8 8-8h64c4.417969 0 8 3.582031 8 8v40zm104 32v8h-336v-8zm-72 136h-8v-76c0-2.210938 1.789062-4 4-4s4 1.789062 4 4zm24 0h-8v-76c0-2.210938 1.789062-4 4-4s4 1.789062 4 4zm16-76c0-2.210938 1.789062-4 4-4s4 1.789062 4 4v76h-8zm4-20c-4.34375.011719-8.558594 1.457031-12 4.105469-7.0625-5.476563-16.9375-5.476563-24 0-3.441406-2.648438-7.65625-4.09375-12-4.105469-11.046875 0-20 8.953125-20 20v84c0 4.417969 3.582031 8 8 8h-64c13.253906 0 24-10.746094 24-24v-48c-.042969-10.132812-6.445312-19.148438-16-22.527344v-25.472656c0-4.417969-3.582031-8-8-8h152v128h-16c4.417969 0 8-3.582031 8-8v-84c0-11.046875-8.953125-20-20-20zm-140 32h16c4.417969 0 8 3.582031 8 8v48c0 4.417969-3.582031 8-8 8h-16c-4.417969 0-8-3.582031-8-8v-48c0-4.417969 3.582031-8 8-8zm-8-40v25.472656c-9.554688 3.378906-15.957031 12.394532-16 22.527344v48c0 13.253906 10.746094 24 24 24h-68c11.046875 0 20-8.953125 20-20-.011719-4.34375-1.457031-8.558594-4.105469-12 5.476563-7.0625 5.476563-16.9375 0-24 2.648438-3.441406 4.09375-7.65625 4.105469-12 0-11.046875-8.953125-20-20-20h-84c-4.417969 0-8 3.582031-8 8v72c0 4.417969 3.582031 8 8 8h-16v-128h168c-4.417969 0-8 3.582031-8 8zm-56 100c0 2.210938-1.789062 4-4 4h-76v-8h76c2.210938 0 4 1.789062 4 4zm0-24c0 2.210938-1.789062 4-4 4h-76v-8h76c2.210938 0 4 1.789062 4 4zm-4-20h-76v-8h76c2.210938 0 4 1.789062 4 4s-1.789062 4-4 4zm236 80v8h-336v-8zm-24 120c4.417969 0 8-3.582031 8-8v-48c0-4.417969-3.582031-8-8-8h-128c-4.417969 0-8 3.582031-8 8v48c0 4.417969 3.582031 8 8 8h-32c4.417969 0 8-3.582031 8-8v-48c0-4.417969-3.582031-8-8-8h-128c-4.417969 0-8 3.582031-8 8v48c0 4.417969 3.582031 8 8 8h-24v-96h336v96zm-120-16v-32h112v32zm-160 0v-32h112v32zm304-384v96h-16c4.417969 0 8-3.582031 8-8v-48c0-13.253906-10.746094-24-24-24h-64c-8.054688.011719-15.566406 4.0625-20 10.785156-4.433594-6.722656-11.945312-10.773437-20-10.785156h-64c-8.054688.011719-15.566406 4.0625-20 10.785156-4.433594-6.722656-11.945312-10.773437-20-10.785156h-64c-13.253906 0-24 10.746094-24 24v48c0 4.417969 3.582031 8 8 8h-16v-96zm0 0"/><path d="m216.5 80h-16c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m112.5 80h-16c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m320.5 80h-16c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m144.5 400h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m304.5 400h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/></svg>',
				lang: {
					en: 'Storage Room',
					fr: 'Salle de stockage'
				},
				surface: 9,
				ratio: 0.7
			},
			garage: {
				icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480"><path d="M240 0C107.5 0 0 107.5 0 240s107.5 240 240 240 240-107.5 240-240C479.9 107.5 372.5 0.2 240 0zM455.3 301.6l-15-4.9 -5 15.2 15.1 4.9c-6.2 17-14.5 33.2-24.7 48.3l-12.8-9.3 -9.4 12.9 12.7 9.2c-11.2 14.3-24 27.1-38.3 38.3l-9.2-12.7 -12.9 9.4 9.3 12.8c-15 10.1-31.2 18.4-48.3 24.7l-4.9-15.1 -15.2 5 4.9 15c-17.4 5-35.4 7.8-53.6 8.5V448h-16v15.8c-18.1-0.6-36.1-3.5-53.6-8.5l4.9-15 -15.2-5L163.2 450.4c-17-6.2-33.2-14.5-48.3-24.7l9.3-12.8 -12.9-9.4 -9.2 12.7c-14.3-11.2-27.1-24.1-38.3-38.3l12.7-9.2 -9.4-12.9 -12.8 9.3C44.1 350 35.8 333.8 29.6 316.8l15.1-4.9 -5-15.2 -15 4.9c-5-17.4-7.9-35.4-8.5-53.6H32v-16H16.2c0.6-18.1 3.5-36.1 8.5-53.6l15 4.9 5-15.2L29.6 163.2c6.2-17 14.5-33.2 24.7-48.3l12.8 9.3 9.4-12.9L63.7 102c11.2-14.3 24.1-27.1 38.3-38.3l9.2 12.7 12.9-9.4 -9.3-12.8C130 44.1 146.2 35.8 163.2 29.6l4.9 15.1 15.2-5 -4.9-15c17.4-5 35.4-7.9 53.6-8.5V32h16V16.2c18.1 0.6 36.1 3.5 53.6 8.5l-4.9 15 15.2 5L316.8 29.6c17 6.2 33.2 14.5 48.3 24.7l-9.3 12.8 12.9 9.4 9.2-12.7c14.3 11.2 27.1 24.1 38.3 38.3l-12.7 9.2 9.4 12.9 12.8-9.3c10.1 15 18.4 31.2 24.6 48.2l-15.1 4.9 5 15.2 15-4.9c5 17.4 7.8 35.4 8.5 53.6H448v16h15.8C463.2 266.1 460.3 284.1 455.3 301.6z"/><path d="M240 64c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176C415.9 142.8 337.2 64.1 240 64zM240 400c-88.4 0-160-71.6-160-160S151.6 80 240 80s160 71.6 160 160C399.9 328.3 328.3 399.9 240 400z"/><path d="M240 104c-75.1 0-136 60.9-136 136s60.9 136 136 136 136-60.9 136-136C375.9 164.9 315.1 104.1 240 104zM342.9 178.5c9.3 15.4 15 32.8 16.6 50.7l-50.1-4c-4.4-0.4-7.7-4.2-7.3-8.6 0.2-2.1 1.2-4 2.7-5.4L342.9 178.5zM266.7 123.1l-19.3 46.4c-1.7 4.1-6.4 6-10.5 4.3 -1.9-0.8-3.5-2.4-4.3-4.3l-19.3-46.4C230.9 119 249.1 119 266.7 123.1zM137.1 178.5L175.2 211.2c3.4 2.9 3.7 7.9 0.9 11.3 -1.4 1.6-3.3 2.6-5.4 2.8l-50.1 4C122.1 211.3 127.8 194 137.1 178.5zM204.5 301.4l-11.6 48.9c-16.6-7.1-31.3-17.9-43.1-31.5h0l42.8-26.1c3.8-2.3 8.7-1.1 11 2.7C204.6 297.2 205 299.3 204.5 301.4zM287.1 350.3h0l-11.6-48.9c-1-4.3 1.6-8.6 5.9-9.6 2.1-0.5 4.2-0.1 6 1l42.8 26.1C318.4 332.4 303.7 343.2 287.1 350.3zM295.8 279c-11.3-6.9-26.1-3.3-33 8 -3.3 5.4-4.3 11.9-2.9 18.1l12 50.5c-20.9 5.9-43 5.9-63.8 0h0l12-50.5c3.1-12.9-4.9-25.8-17.8-28.9 -6.2-1.5-12.6-0.4-18 2.9l-44.3 27c-12-18.1-18.8-39.1-19.7-60.7l51.7-4.2c13.2-1.1 23-12.7 22-25.9 -0.5-6.3-3.5-12.1-8.3-16.3l-39.4-33.8c13.5-16.9 31.4-29.9 51.6-37.5l19.9 47.9c5.1 12.2 19.1 18 31.4 12.9 5.8-2.4 10.5-7.1 12.9-12.9l19.9-47.9c20.3 7.6 38.1 20.6 51.6 37.5L294.4 199c-10.1 8.6-11.2 23.8-2.6 33.8 4.1 4.8 10 7.8 16.3 8.3l51.7 4.2c-0.9 21.7-7.7 42.6-19.7 60.7L295.8 279z"/><path d="M240 208c-17.7 0-32 14.3-32 32s14.3 32 32 32c17.7 0 32-14.3 32-32S257.7 208 240 208zM240 256c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16S248.8 256 240 256z"/></svg>',
				lang: {
					en: 'Garage',
					fr: 'Garage'
				},
				surface: 20,
				ratio: 0.6
			},
			bathroom: {
				icon: '<svg height="480pt" viewBox="-36 0 480 480" width="480pt" xmlns="http://www.w3.org/2000/svg"><path d="m72 0h-48c-13.253906 0-24 10.746094-24 24v384c.0429688 10.132812 6.445312 19.148438 16 22.527344v41.472656c0 4.417969 3.582031 8 8 8s8-3.582031 8-8v-40h32v40c0 4.417969 3.582031 8 8 8s8-3.582031 8-8v-41.472656c9.554688-3.378906 15.957031-12.394532 16-22.527344v-384c0-13.253906-10.746094-24-24-24zm-56 272v-32h64v32zm64 16v32h-64v-32zm-64-64v-32h64v32zm0 112h64v32h-64zm8-320h48c4.417969 0 8 3.582031 8 8v152h-64v-152c0-4.417969 3.582031-8 8-8zm48 400h-48c-4.417969 0-8-3.582031-8-8v-24h64v24c0 4.417969-3.582031 8-8 8zm0 0"/><path d="m56 200h-16c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m56 248h-16c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m40 312h16c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8h-16c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8zm0 0"/><path d="m56 344h-16c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m56 392h-16c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h16c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m64 112c4.417969 0 8-3.582031 8-8v-32c0-4.417969-3.582031-8-8-8s-8 3.582031-8 8v32c0 4.417969 3.582031 8 8 8zm0 0"/><path d="m384 216v-168c13.253906 0 24-10.746094 24-24s-10.746094-24-24-24h-256c-13.253906 0-24 10.746094-24 24s10.746094 24 24 24v168c-13.253906 0-24 10.746094-24 24s10.746094 24 24 24h24c-13.253906 0-24 10.746094-24 24v48c.011719 8.054688 4.0625 15.566406 10.785156 20-6.722656 4.433594-10.773437 11.945312-10.785156 20v48c0 13.253906 10.746094 24 24 24h8v24c0 4.417969 3.582031 8 8 8s8-3.582031 8-8v-24h160v24c0 4.417969 3.582031 8 8 8s8-3.582031 8-8v-24h8c13.253906 0 24-10.746094 24-24v-48c-.011719-8.054688-4.0625-15.566406-10.785156-20 6.722656-4.433594 10.773437-11.945312 10.785156-20v-48c0-13.253906-10.746094-24-24-24h24c13.253906 0 24-10.746094 24-24s-10.746094-24-24-24zm-16 208c0 4.417969-3.582031 8-8 8h-208c-4.417969 0-8-3.582031-8-8v-48c0-4.417969 3.582031-8 8-8h208c4.417969 0 8 3.582031 8 8zm0-136v48c0 4.417969-3.582031 8-8 8h-208c-4.417969 0-8-3.582031-8-8v-48c0-4.417969 3.582031-8 8-8h208c4.417969 0 8 3.582031 8 8zm-248-264c0-4.417969 3.582031-8 8-8h256c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8h-256c-4.417969 0-8-3.582031-8-8zm24 24h224v168h-224zm240 200h-256c-4.417969 0-8-3.582031-8-8s3.582031-8 8-8h256c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8zm0 0"/><path d="m272 304h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m272 392h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h32c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/><path d="m335.199219 147.550781c.535156-1.105469.8125-2.320312.800781-3.550781v-8c0-4.417969-3.582031-8-8-8s-8 3.582031-8 8h-56v-52c0-2.210938 1.789062-4 4-4s4 1.789062 4 4v12c0 4.417969 3.582031 8 8 8s8-3.582031 8-8v-12c0-11.046875-8.953125-20-20-20s-20 8.953125-20 20v52h-56c0-4.417969-3.582031-8-8-8s-8 3.582031-8 8v8c-.011719 1.230469.265625 2.445312.800781 3.550781 5.714844 39.324219 39.429688 68.492188 79.167969 68.492188s73.449219-29.167969 79.167969-68.492188zm-79.199219 52.449219c-29.171875-.042969-54.640625-19.765625-61.976562-48h123.953124c-7.335937 28.234375-32.804687 47.957031-61.976562 48zm0 0"/><path d="m346.34375 85.65625c3.140625 3.03125 8.128906 2.988281 11.214844-.097656 3.085937-3.085938 3.128906-8.074219.097656-11.214844l-16-16c-3.140625-3.03125-8.128906-2.988281-11.214844.097656-3.085937 3.085938-3.128906 8.074219-.097656 11.214844zm0 0"/><path d="m338.34375 101.65625c3.140625 3.03125 8.128906 2.988281 11.214844-.097656 3.085937-3.085938 3.128906-8.074219.097656-11.214844l-32-32c-3.140625-3.03125-8.128906-2.988281-11.214844.097656-3.085937 3.085938-3.128906 8.074219-.097656 11.214844zm0 0"/></svg>',
				lang: {
					en: 'Bathroom',
					fr: 'Salle de bain'
				},
				surface: 8,
				ratio: 0.2
			},
			other: {
				icon: '<svg height="488pt" viewBox="-4 0 488 488" width="488pt" xmlns="http://www.w3.org/2000/svg"><path d="m456 0h-432c-13.253906 0-24 10.746094-24 24s10.746094 24 24 24h20.449219c-2.878907 4.84375-4.417969 10.367188-4.449219 16v80c.03125 9.226562 4.0625 17.980469 11.054688 24-6.992188 6.019531-11.023438 14.773438-11.054688 24v80c.03125 9.226562 4.0625 17.980469 11.054688 24-6.992188 6.019531-11.023438 14.773438-11.054688 24v80c0 17.671875 14.328125 32 32 32h10.609375l5.4375 48.886719c.453125 4.050781 3.878906 7.113281 7.953125 7.113281h32c4.074219 0 7.5-3.0625 7.953125-7.113281l5.4375-48.886719h197.21875l5.4375 48.886719c.453125 4.050781 3.878906 7.113281 7.953125 7.113281h32c4.074219 0 7.5-3.0625 7.953125-7.113281l5.4375-48.886719h10.609375c17.671875 0 32-14.328125 32-32v-80c-.03125-9.226562-4.0625-17.980469-11.054688-24 6.992188-6.019531 11.023438-14.773438 11.054688-24v-80c-.03125-9.226562-4.0625-17.980469-11.054688-24 6.992188-6.019531 11.023438-14.773438 11.054688-24v-80c-.03125-5.632812-1.570312-11.15625-4.449219-16h20.449219c13.253906 0 24-10.746094 24-24s-10.746094-24-24-24zm-335.160156 472h-17.640625l-4.457031-40h26.59375zm256 0h-17.640625l-4.457031-40h26.59375zm47.160156-152v80c0 8.835938-7.164062 16-16 16h-336c-8.835938 0-16-7.164062-16-16v-80c0-8.835938 7.164062-16 16-16h336c8.835938 0 16 7.164062 16 16zm0-128v80c0 8.835938-7.164062 16-16 16h-336c-8.835938 0-16-7.164062-16-16v-80c0-8.835938 7.164062-16 16-16h336c8.835938 0 16 7.164062 16 16zm0-128v80c0 8.835938-7.164062 16-16 16h-336c-8.835938 0-16-7.164062-16-16v-80c0-8.835938 7.164062-16 16-16h336c8.835938 0 16 7.164062 16 16zm32-32h-432c-4.417969 0-8-3.582031-8-8s3.582031-8 8-8h432c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8zm0 0"/><path d="m240 384c13.253906 0 24-10.746094 24-24s-10.746094-24-24-24-24 10.746094-24 24 10.746094 24 24 24zm0-32c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8-8-3.582031-8-8 3.582031-8 8-8zm0 0"/><path d="m240 256c13.253906 0 24-10.746094 24-24s-10.746094-24-24-24-24 10.746094-24 24 10.746094 24 24 24zm0-32c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8-8-3.582031-8-8 3.582031-8 8-8zm0 0"/><path d="m240 128c13.253906 0 24-10.746094 24-24s-10.746094-24-24-24-24 10.746094-24 24 10.746094 24 24 24zm0-32c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8-8-3.582031-8-8 3.582031-8 8-8zm0 0"/></svg>',
				lang: {
					en: 'Other',
					fr: 'Autre'
				},
				surface: 10,
				ratio: this.surfaceToVolumeRatio
			}
		};
		
		// Use custom rooms if needed
		this._rooms = this._parameters.rooms || this._rooms;
	}

	/**
     * Loads the dictionary
     * @private
     */
    _loadDictionary(){
		/** @private */
		this._dictionary = {
			en: {
				volume: 'Volume',
				surfaceOptionEnable: 'I don\'t know my volume / I\'d rather fill out my surface',
				surfaceOptionDisable: 'I\'d rather fill out my volume',
				wrongVolume: 'The volume isn\'t a valid number',
				surface: 'Surface',
				wrongSurface: 'The surface isn\'t a valid number',
				roomsOptionEnable: 'I prefer filling out my rooms\' detail',
				roomsOptionDisable: 'I\'d rather fill out my surface',
				validateButton: 'Validate my volume'
			},
			fr: {
				volume: 'Volume',
				surfaceOptionEnable: 'Je ne connais pas mon volume / Je préfère renseigner ma surface',
				surfaceOptionDisable: 'Je préfère renseigner mon volume',
				wrongVolume: 'Le volume n\'est pas un nombre valide',
				surface: 'Surface',
				wrongSurface: 'The surface isn\'t a valid number',
				roomsOptionEnable: 'Je préfère renseigner le détail de mes pièces',
				roomsOptionDisable: 'Je préfère renseigner ma surface',
				validateButton: 'Valider mon volume'
			}
		};
		
		// Add custom translations
		this._dictionary = Object.assign(this._dictionary, this._parameters.dictionary || {});

		// Add rooms translations
		Object.entries(this._rooms).forEach(([room, infos]) => {
			Object.entries(infos.lang).forEach(([lang, translation]) => {
				this._dictionary[lang][room] = translation;
			});
		});
	}
	
	/**
     * Builds the MovingVolumeCalculator DOM Tree inside the element
     * @private
     */
    _build(){
		this._wrapper.classList.add('mvc-wrapper');
		if(this._parameters.stylised) this._wrapper.classList.add('mvc-stylised');

		/*
		 *	Volume Input
		 */
		let line = document.createElement('p');

		line.classList.add('mvc-volume-wrapper');

		this._wrapper.appendChild(line);

		let label = document.createElement('span');

		label.classList.add('mvc-label');
		label.innerHTML = this._translated().volume + ' (m<sup>3</sup>)';
		line.appendChild(label);

		/** @private */
		this._volumeInput = document.createElement('input');
		this._volumeInput.classList.add('mvc-volume-input');
		line.appendChild(this._volumeInput);

		/** @private */
		this._quickValidator = document.createElement('button');
		this._quickValidator.classList.add('mvc-volume-validate');
		this._quickValidator.innerHTML = 'OK';
		line.appendChild(this._quickValidator);

		/*
		 *	Surface toggler
		 */
		line = document.createElement('p');
		line.classList.add('mvc-surface-toggler');
		this._wrapper.appendChild(line);

		/** @private */
		this._surfaceOption = document.createElement('a');
		this._surfaceOption.classList.add('mvc-surface-enable');
		this._surfaceOption.innerText = this._translated().surfaceOptionEnable;
		this._surfaceOption.href = '';
		line.appendChild(this._surfaceOption);

		/*
		 *	Surface Input
		 */
		line = document.createElement('p');
		line.classList.add('mvc-hidden', 'mvc-surface-wrapper');
		this._wrapper.appendChild(line);

		label = document.createElement('span');
		label.classList.add('mvc-label');
		label.innerHTML = this._translated().surface + ' (m<sup>2</sup>)';
		line.appendChild(label);

		/** @private */
		this._surfaceInput = document.createElement('input');
		this._surfaceInput.classList.add('mvc-surface-input');
		line.appendChild(this._surfaceInput);

		/*
		 *	Rooms toggler
		 */
		line = document.createElement('p');
		line.classList.add('mvc-rooms-toggler', 'mvc-hidden');
		this._wrapper.appendChild(line);

		/** @private */
		this._roomsOption = document.createElement('a');
		this._roomsOption.classList.add('mvc-rooms-enable');
		this._roomsOption.innerText = this._translated().roomsOptionEnable;
		this._roomsOption.href = '';
		line.appendChild(this._roomsOption);

		/*
		 *	Rooms choice
		 */
		line = document.createElement('p');
		line.classList.add('mvc-rooms-wrapper', 'mvc-hidden');
		this._wrapper.appendChild(line);

		const roomsList = document.createElement('ul');

		roomsList.classList.add('mvc-rooms');
		line.appendChild(roomsList);

		/** @private */
		this._roomsCancel = [];

		Object.entries(this._rooms).forEach(([room, infos]) => {
			const 	li = document.createElement('li'),
					span = document.createElement('span'),
					cancel = document.createElement('p'),
					surface = document.createElement('p');

			li.setAttribute('data-type', room);
			li.setAttribute('data-amount', '0');
			span.innerText = this._translated()[room];

			//Create an img tag if needed
			try{
				new URL(infos.icon);
				const icon = document.createElement('img');

				icon.src = infos.icon;
				icon.classList.add('mvc-rooms-icon');
				li.appendChild(icon);
			}catch(_){
				li.innerHTML = infos.icon;
				li.firstElementChild.classList.add('mvc-rooms-icon');
			}

			cancel.classList.add('mvc-rooms-cancel');
			cancel.innerText = 'x';

			surface.classList.add('mvc-rooms-surface');
			surface.innerText = '~' + infos.surface + 'm²';

			li.appendChild(span);
			li.appendChild(cancel);
			li.appendChild(surface);
			roomsList.appendChild(li);

			this._roomsCancel.push(cancel);
		});

		/** @private */
		this._roomsList = Array.from(roomsList.children);

		/*
		 *	Validator
		 */
		line = document.createElement('p');
		line.classList.add('mvc-validate', 'mvc-hidden');
		this._wrapper.appendChild(line);

		this._validator = document.createElement('button');
		this._validator.innerText = this._translated().validateButton;
		line.appendChild(this._validator);
		
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
				this.updateData();
			}else if(this._volumeInput.value.length) this._addHint(this._volumeInput, 'error', this._translated().wrongVolume);
			
			// Call onChange callbacks
			for(const callback of this._onChange) Reflect.apply(callback, this, [+this._volumeInput.value]);
		});

		// Volume validator handler
		this._quickValidator.addEventListener('click', () => {
			this.validate();
		});

		// Surface toggler handler
		this._surfaceOption.addEventListener('click', e => {
			e.preventDefault();
			
			if(this._surfaceOption.classList.contains('mvc-surface-enable')){
				if(this._volumeInput.value.length) this._predictSurface();

				this._surfaceOption.classList.remove('mvc-surface-enable');
				this._surfaceOption.classList.add('mvc-surface-disable');
				this._surfaceOption.innerText = this._translated().surfaceOptionDisable;

				this._volumeInput.disabled = true;

				this._quickValidator.classList.add('mvc-hidden');

				this._surfaceInput.parentElement.classList.remove('mvc-hidden');
				this._roomsOption.parentElement.classList.remove('mvc-hidden');
				this._validator.parentElement.classList.remove('mvc-hidden');
			}else{
				this._surfaceOption.classList.remove('mvc-surface-disable');
				this._surfaceOption.classList.add('mvc-surface-enable');
				this._surfaceOption.innerText = this._translated().surfaceOptionEnable;

				this._volumeInput.disabled = false;

				this._quickValidator.classList.remove('mvc-hidden');

				this._surfaceInput.parentElement.classList.add('mvc-hidden');
				this._roomsOption.parentElement.classList.add('mvc-hidden');
				this._validator.parentElement.classList.add('mvc-hidden');
			}
		});

		// Surface input handler
		this._surfaceInput.addEventListener('input', () => {
			if((/^\d+([.,]\d{0,2})?$/u).test(this._surfaceInput.value)){
				this._clearHints(this._surfaceInput);

				const volume = MovingVolumeCalculator.fromSurface(+this._surfaceInput.value.replace(',', '.'));

				this.volume = volume;
				this._volumeInput.value = volume;
				this.updateData();
			}else if(this._surfaceInput.value.length) this._addHint(this._surfaceInput, 'error', this._translated().wrongSurface);
		});

		// Rooms toggler handler
		this._roomsOption.addEventListener('click', e => {
			e.preventDefault();
			
			if(this._roomsOption.classList.contains('mvc-rooms-enable')){
				this._roomsOption.classList.remove('mvc-rooms-enable');
				this._roomsOption.classList.add('mvc-rooms-disable');
				this._roomsOption.innerText = this._translated().roomsOptionDisable;

				this._surfaceOption.parentNode.classList.add('mvc-hidden');
				this._surfaceInput.parentElement.classList.add('mvc-hidden');
				this._roomsList[0].parentElement.parentElement.classList.remove('mvc-hidden');
			}else{
				this._roomsOption.classList.remove('mvc-rooms-disable');
				this._roomsOption.classList.add('mvc-rooms-enable');
				this._roomsOption.innerText = this._translated().roomsOptionEnable;

				
				this._surfaceOption.parentNode.classList.remove('mvc-hidden');
				this._surfaceInput.parentElement.classList.remove('mvc-hidden');
				this._roomsList[0].parentElement.parentElement.classList.add('mvc-hidden');
			}
		});

		// Rooms chosing handler
		this._roomsList.forEach(room => {
			room.addEventListener('click', () => {
				room.setAttribute('data-amount', this.data.rooms[room.getAttribute('data-type')] + 1);

				this._volumeInput.value = Math.round(this._roomsList.reduce((acc, curr) => acc += this._rooms[curr.getAttribute('data-type')].surface * this._rooms[curr.getAttribute('data-type')].ratio * +curr.getAttribute('data-amount'), 0) * 100) / 100 || '';
				this.updateData();
			});
		});

		//Rooms canceling handler
		this._roomsCancel.forEach(cancel => {
			cancel.addEventListener('click', e => {
				e.stopPropagation();
				
				cancel.parentNode.setAttribute('data-amount', this.data.rooms[cancel.parentNode.getAttribute('data-type')] - 1);
				
				this._volumeInput.value = Math.round(this._roomsList.reduce((acc, curr) => acc += this._rooms[curr.getAttribute('data-type')].surface * this._rooms[curr.getAttribute('data-type')].ratio * +curr.getAttribute('data-amount'), 0) * 100) / 100 || '';
				this.updateData();
			});
		});

		//Validation handler
		this._validator.addEventListener('click', () => {
			this.validate();
		});

		//Unvalidation handler
		this._volumeInput.parentElement.addEventListener('click', e => {
			if(e.target == this._volumeInput && this._volumeInput.classList.contains('mvc-validated')){
				this.validate(false);
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
     * Prefills the surface field from the given volume
     * @private
     */
    _predictSurface(){
		this._surfaceInput.value = Math.round(this.volume * (1 / this.surfaceToVolumeRatio) * 100) / 100;
	}

	/**
     * Returns the dictionnary for the current lang
	 * @returns {Object} The dictionnary for the current lang
     * @private
     */
    _translated(){
		return this._dictionary[this._parameters.lang];
	}

	/**
     * Updates the data attribute from the current MovingVolumeCalculator
	 * @returns {MovingVolumeCalculator} The current MovingVolumeCalculator
     */
    updateData(){
		this.data.volume = +this._volumeInput.value.replace(',', '.');
		this.data.surface = +this._surfaceInput.value.replace(',', '.');

		this.data.rooms = this._roomsList.reduce((acc, curr) => {
			acc[curr.getAttribute('data-type')] = +curr.getAttribute('data-amount');

			return acc;
		}, {});

		this.volume = this.data.volume;

		return this;
	}

	/**
     * Sets the lang
	 * @param {String} lang The lang to set
	 * @returns {MovingVolumeCalculator} The current MovingVolumeCalculator
     */
    setLang(lang){
		this._parameters.lang = lang || 'en';

		return this;
	}

	/**
     * Sets the volume
	 * @param {String} volume The volume to set
	 * @returns {MovingVolumeCalculator} The current MovingVolumeCalculator
     */
    setVolume(volume){
		this._volumeInput.value = volume;

		return this.updateData();
	}

	/**
     * Validates the current volume
	 * @param {Boolean} [toggler=true] TRUE to validate | false to unvalidate
	 * @returns {MovingVolumeCalculator} The current MovingVolumeCalculator
     */
    validate(toggler = true){
		if(toggler){
			this.volume = this.data.volume || 0;
			this._volumeInput.value = this.volume;
			this._volumeInput.disabled = true;

			this._volumeInput.classList.add('mvc-validated');
			this._quickValidator.classList.add('mvc-hidden');

			this._surfaceOption.parentNode.classList.add('mvc-hidden');
			this._surfaceOption.classList.add('mvc-surface-enable');
			this._surfaceOption.classList.remove('mvc-surface-disable');
			this._surfaceOption.innerText = this._translated().surfaceOptionEnable;
			this._surfaceInput.parentNode.classList.add('mvc-hidden');

			this._roomsOption.parentNode.classList.add('mvc-hidden');
			this._roomsOption.classList.add('mvc-rooms-enable');
			this._roomsOption.classList.remove('mvc-rooms-disable');
			this._roomsOption.innerText = this._translated().roomsOptionEnable;

			this._roomsList[0].parentNode.parentNode.classList.add('mvc-hidden');

			this._validator.parentNode.classList.add('mvc-hidden');

			// Call onValidate callbacks
			for(const callback of this._onValidate) Reflect.apply(callback, this, [this.data]);
		}else{
			this._volumeInput.disabled = false;
			this._volumeInput.classList.remove('mvc-validated');
			this._quickValidator.classList.remove('mvc-hidden');
			this._surfaceOption.parentNode.classList.remove('mvc-hidden');
		}
		

		return this;
	}

	/**
     * Function called after a volume validation.
     * Using <code>this</code> inside it will return the current {@link MovingVolumeCalculator}
     *
     * @callback onValidateCallback
     * @param {Object} data The module data
     */

    /**
     * Adds a callback to be used when the user validates the volume
     * @param {onSelectCallback} callback Function to call after the user's validation
     * @returns {MovingVolumeCalculator}  The current {@link MovingVolumeCalculator}
     */
    onValidate(callback){
		this._onValidate.push(callback);

		return this;
	}

	/**
     * Removes every callback previously added with {@link MovingVolumeCalculator#onValidate}
     * @returns {MovingVolumeCalculator} The current {@link MovingVolumeCalculator}
     */
    offValidate(){
		this._onValidate = [];
		
        return this;
	}
	
	/**
     * Function called after a volume change.
     * Using <code>this</code> inside it will return the current {@link MovingVolumeCalculator}
     *
     * @callback onChangeCallback
     * @param {Number} volume The current volume
     */

    /**
     * Adds a callback to be used when the user changes the volume
     * @param {onSelectCallback} callback Function to call after the user's change
     * @returns {MovingVolumeCalculator}  The current {@link MovingVolumeCalculator}
     */
    onChange(callback){
		this._onChange.push(callback);

		return this;
	}

	/**
     * Removes every callback previously added with {@link MovingVolumeCalculator#onChange}
     * @returns {MovingVolumeCalculator} The current {@link MovingVolumeCalculator}
     */
    offChange(){
		this._onChange = [];
		
        return this;
	}
	
	/**
	 * Checks if the volume value is valid
	 * @returns {Boolean} TRUE if the volume input contains a valid value
	 */
	isValid(){
		return this._volumeInput.value.length && (/^\d+([.,]\d{0,2})?$/u).test(this._volumeInput.value);
	}

	/**
     * Removes any MovingVolumeCalculator mutation from the DOM
     */
    destroy(){
		this._wrapper.innerHTML = '';
		this._wrapper.classList.remove('mvc-wrapper', 'mvc-stylised');
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

		if(element && element.classList.contains('mvc-wrapper')){
			element.innerHTML = '';
			element.classList.remove('mvc-wrapper', 'mvc-stylised');
		}
	}
}