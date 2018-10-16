# Moving Volume Calculator [(Demo)](https://jsfiddle.net/Zenoo0/9z6evb7a/)

Calculate the volume for your move

### Doc

* **Installation**

Simply import MovingVolumeCalculator into your HTML.
```
<link rel="stylesheet" type="text/css" href="https://gitcdn.link/repo/Zenoo/moving-volume-calculator/master/MovingVolumeCalculator.min.css">
<script src="https://gitcdn.link/repo/Zenoo/moving-volume-calculator/master/MovingVolumeCalculator.min.js"></script>	
```
* **How to use**

Create a new [`MovingVolumeCalculator`](https://zenoo.github.io/moving-volume-calculator/MovingVolumeCalculator.html) object with a query String or an Element as the first parameter :
```
let movingVolumeCalculator = new MovingVolumeCalculator('div.with[any="selector"]', options);
// OR
let element = document.querySelector('li.terally[any="thing"]');
let movingVolumeCalculator = new MovingVolumeCalculator(element, options);
```
* **Options**

```
{
	lang: 'en', // Language to use
	surfaceToVolumeRatio: 0.45, // Default surface to volume ratio
	rooms: { // See https://zenoo.github.io/moving-volume-calculator/MovingVolumeCalculator.html#.Rooms
		kitchen: {
			icon: 'https://your.icon',
			lang: {
			en: 'Kitchen',
			fr: 'Cuisine'
			},
			surface: 14,
			ratio: 0.45
		}, ...
	},
	dictionary: {// See https://zenoo.github.io/moving-volume-calculator/MovingVolumeCalculator.html#.Dictionary
		en: {
			roomsOptionEnable: 'I prefer filling out my rooms\' details',
			roomsOptionDisable: 'I\'d rather fill out my surface'
		},
		fr: {
			roomsOptionEnable: 'Je préfère renseigner le détail de mes pièces',
			roomsOptionDisable: 'Je préfère renseigner ma surface'
		}
	}
}
```
* **Methods**

See the [documentation](https://zenoo.github.io/moving-volume-calculator/MovingVolumeCalculator.html) for the method definitions.  

* **Example**

See this [JSFiddle](https://jsfiddle.net/Zenoo0/9z6evb7a/) for a working example

## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
* <div>Icons made by <a href="https://www.flaticon.com/authors/phatplus" title="phatplus">phatplus</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>