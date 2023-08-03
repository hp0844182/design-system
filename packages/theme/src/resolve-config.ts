import Color from 'color'
import { forEach, kebabCase, mapKeys } from 'lodash-es'
import { ConfigTheme, ConfigThemes, DefaultThemeType } from './types'
import { generateSpacingScale } from './utils/theme'
import { flattenThemeObject } from './utils/object'
/**
 * Resolves the configuration for the themes, default theme, and prefix.
 *
 * @param {ConfigThemes} themes - The themes object containing the theme configurations.
 * @param {DefaultThemeType} defaultTheme - The default theme.
 * @param {string} prefix - The prefix to be used for CSS variables.
 */
export function resolveConfig(
	themes: ConfigThemes = {},
	defaultTheme:DefaultThemeType,
	prefix:string
){
	const resolved: {
    variants: {name: string; definition: string[]}[];
    utilities: Record<string, Record<string, any>>;
    colors: Record<
      string,
      ({opacityValue, opacityVariable}: {opacityValue: string; opacityVariable: string}) => string
    >;
  } = {
  	variants: [],
  	utilities: {},
  	colors: {},
  }
	forEach(themes, ({extend, layout, colors}: ConfigTheme, themeName: string) => {
		let cssSelector = `.${themeName},[data-theme="${themeName}"]`
		const scheme = themeName === 'light' || themeName === 'dark' ? themeName : extend

		// if the theme is the default theme, add the selector to the root element
		if (themeName === defaultTheme) {
			cssSelector = `:root,${cssSelector}`
		}

		resolved.utilities[cssSelector] = scheme
			? {
				'color-scheme': scheme,
			}
			: {}

		// flatten color definitions ===> {primary:'#***','primary-50':'#**', ...}
		const flatColors = flattenThemeObject(colors)

		const flatLayout = layout ? mapKeys(layout, (value, key) => kebabCase(key)) : {}

		// resolved.variants
		resolved.variants.push({
			name: themeName,
			definition: [`&.${themeName}`, `&[data-theme='${themeName}']`],
		})

		/**
     * Colors
     */
		forEach(flatColors, (colorValue, colorName) => {
			if (!colorValue) return

			try {
				// const [h, s, l, defaultAlphaValue] = parseToHsla(colorValue);
				const [h, s, l, defaultAlphaValue] = Color(colorValue).hsl().round().array()
				const nextuiColorVariable = `--${prefix}-${colorName}`
				const nextuiOpacityVariable = `--${prefix}-${colorName}-opacity`

        // set the css variable in "@layer utilities"
        resolved.utilities[cssSelector]![nextuiColorVariable] = `${h} ${s}% ${l}%`
        // if an alpha value was provided in the color definition, store it in a css variable
        if (typeof defaultAlphaValue === 'number') {
          resolved.utilities[cssSelector]![nextuiOpacityVariable] = defaultAlphaValue.toFixed(2)
        }
        // set the dynamic color in tailwind config theme.colors
        resolved.colors[colorName] = ({opacityVariable, opacityValue}) => {
        	// if the opacity is set  with a slash (e.g. bg-primary/90), use the provided value
        	if (!isNaN(+opacityValue)) {
        		return `hsl(var(${nextuiColorVariable}) / ${opacityValue})`
        	}
        	// if no opacityValue was provided (=it is not parsable to a number)
        	// the nextuiOpacityVariable (opacity defined in the color definition rgb(0, 0, 0, 0.5)) should have the priority
        	// over the tw class based opacity(e.g. "bg-opacity-90")
        	// This is how tailwind behaves as for v3.2.4
        	if (opacityVariable) {
        		return `hsl(var(${nextuiColorVariable}) / var(${nextuiOpacityVariable}, var(${opacityVariable})))`
        	}

        	return `hsl(var(${nextuiColorVariable}) / var(${nextuiOpacityVariable}, 1))`
        }
			} catch (error: any) {
				// eslint-disable-next-line no-console
				console.log('error', error?.message)
			}
		})

		/**
     * Layout
     */
		forEach(flatLayout, (value, key) => {
			if (!value) return

			if (typeof value === 'object') {
				forEach(value, (v, k) => {
					const layoutVariable = `--${prefix}-${key}-${k}`

          resolved.utilities[cssSelector]![layoutVariable] = v
				})
			} else if (key === 'spacing-unit') {
				const layoutVariable = `--${prefix}-${key}`

        // add the base unit "--spacing-unit: value"
        resolved.utilities[cssSelector]![layoutVariable] = value

        const spacingScale = generateSpacingScale(Number(value))

        // add the list of spacing units "--spacing-unit-[key]: value"
        forEach(spacingScale, (v, k) => {
        	const layoutVariable = `--${prefix}-${key}-${k}`

          resolved.utilities[cssSelector]![layoutVariable] = v
        })
			} else {
				const layoutVariable = `--${prefix}-${key}`

        resolved.utilities[cssSelector]![layoutVariable] = value
			}
		})

	})
	
	return resolved
}
