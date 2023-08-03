import {ConfigTheme, ConfigThemes, DefaultThemeType, NextUIPluginConfig} from './types'
import { get, omit } from 'lodash-es'
import plugin from 'tailwindcss/plugin'
import deepMerge from 'deepMerge'
import { darkLayout, defaultLayout, lightLayout } from './default-layout'
import { semanticColors } from './colors/semantic'
import { resolveConfig } from './resolve-config'
import { baseStyles } from './utils/classes'
import { utilities } from './utilities'
import { commonColors } from './colors/common'
import { createSpacingUnits } from './utils/theme'
import { animations } from './animations'

const DEFAULT_PREFIX = 'seapillar'




/**
 * Generates a seapillar configuration object based on the provided NextUIPluginConfig.
 *
 * @param {NextUIPluginConfig} config - The configuration object for the seapillar plugin. (default = {})
 * @param {NextUIPluginConfig['themes']} config.themes - The themes object containing the light and dark theme configurations.
 * @param {NextUIPluginConfig['defaultTheme']} config.defaultTheme - The default theme to use. (default = 'light')
 * @param {NextUIPluginConfig['layout']} config.layout - The layout configuration object.
 * @param {NextUIPluginConfig['defaultExtendTheme']} config.defaultExtendTheme - The default theme to extend. (default = 'light')
 * @param {NextUIPluginConfig['prefix']} config.prefix - The default prefix for the seapillar plugin. (default = DEFAULT_PREFIX)
 * @param {boolean} config.addCommonColors - Whether to add common colors to the theme. (default = false)
 * @param {object} config.themes.light - The configuration object for the light theme.
 * @param {object} config.themes.dark - The configuration object for the dark theme.
 * @param {object} config.themes.light.layout - The layout configuration object for the light theme.
 * @param {object} config.themes.dark.layout - The layout configuration object for the dark theme.
 * @param {object} config.themes.light.colors - The colors configuration object for the light theme.
 * @param {object} config.themes.dark.colors - The colors configuration object for the dark theme.
 * @return {void}
 */
export function seapillar(config: NextUIPluginConfig = {}){
	const {
		themes: themeObject = {},
		defaultTheme = 'light',
		layout: userLayout,
		// defaultExtendTheme = 'light',
		prefix: defaultPrefix = DEFAULT_PREFIX,
		addCommonColors = false,
	} = config

	const userLightColors = get(themeObject, 'light.colors', {})
	const userDarkColors = get(themeObject, 'dark.colors', {})
  
	const defaultLayoutObj =
    userLayout && typeof userLayout === 'object'
    	? deepMerge(defaultLayout, userLayout)
    	: defaultLayout
	const baseLayouts = {
		light: {
			...defaultLayoutObj,
			...lightLayout,
		},
		dark: {
			...defaultLayoutObj,
			...darkLayout,
		},
	}

	const light: ConfigTheme = {
		layout: deepMerge(baseLayouts.light, get(themeObject, 'light.layout', {})),
		colors: deepMerge(semanticColors.light, userLightColors),
	}

	const dark = {
		layout: deepMerge(baseLayouts.dark, get(themeObject, 'dark.layout', {})),
		colors: deepMerge(semanticColors.dark, userDarkColors),
	}
	
	const themes = {
		light,
		dark,
	}
	return corePlugin({themes, defaultTheme, prefix: defaultPrefix, addCommonColors})
}

function corePlugin(config: NextUIPluginConfig = {}){
	const { themes,defaultTheme,prefix,addCommonColors } = config
	const resolved = resolveConfig(themes, defaultTheme!, prefix!)
	const minSizes = {
		'unit-1': `var(--${prefix}-spacing-unit)`,
		'unit-2': `var(--${prefix}-spacing-unit-2`,
		'unit-3': `var(--${prefix}-spacing-unit-3)`,
		'unit-3.5': `var(--${prefix}-spacing-unit-3_5)`,
		'unit-4': `var(--${prefix}-spacing-unit-4)`,
		'unit-5': `var(--${prefix}-spacing-unit-5)`,
		'unit-6': `var(--${prefix}-spacing-unit-6)`,
		'unit-7': `var(--${prefix}-spacing-unit-7)`,
		'unit-8': `var(--${prefix}-spacing-unit-8)`,
		'unit-9': `var(--${prefix}-spacing-unit-9)`,
		'unit-10': `var(--${prefix}-spacing-unit-10)`,
		'unit-11': `var(--${prefix}-spacing-unit-11)`,
		'unit-12': `var(--${prefix}-spacing-unit-12)`,
		'unit-16': `var(--${prefix}-spacing-unit-16)`,
		'unit-20': `var(--${prefix}-spacing-unit-20)`,
		'unit-24': `var(--${prefix}-spacing-unit-24)`,
	}
	return plugin(
		({addBase, addUtilities, addVariant}) => {
			// add base classNames
			addBase({
				[':root']: {
					...baseStyles(prefix!),
				},
			})
			// add the css variables to "@layer utilities"
			addUtilities({...resolved.utilities, ...utilities})
			// add the theme as variant e.g. "[theme-name]:text-2xl"
			resolved.variants.forEach((variant) => {
				addVariant(variant.name, variant.definition)
			})
		},
		// extend the colors config
		{
			theme: {
				extend: {
					// @ts-ignore
					colors: {
						...(addCommonColors ? commonColors : {}),
						...resolved.colors,
					},
					height: {
						divider: `var(--${prefix}-divider-weight)`,
					},
					width: {
						divider: `var(--${prefix}-divider-weight)`,
					},
					spacing: {
						unit: `var(--${prefix}-spacing-unit)`,
						...createSpacingUnits(prefix!),
					},
					minWidth: {
						...minSizes,
					},
					minHeight: {
						...minSizes,
					},
					fontSize: {
						tiny: [`var(--${prefix}-font-size-tiny)`, `var(--${prefix}-line-height-tiny)`],
						small: [`var(--${prefix}-font-size-small)`, `var(--${prefix}-line-height-small)`],
						medium: [`var(--${prefix}-font-size-medium)`, `var(--${prefix}-line-height-medium)`],
						large: [`var(--${prefix}-font-size-large)`, `var(--${prefix}-line-height-large)`],
					},
					borderRadius: {
						small: `var(--${prefix}-radius-small)`,
						medium: `var(--${prefix}-radius-medium)`,
						large: `var(--${prefix}-radius-large)`,
					},
					opacity: {
						disabled: `var(--${prefix}-disabled-opacity)`,
					},
					borderWidth: {
						small: `var(--${prefix}-border-width-small)`,
						medium: `var(--${prefix}-border-width-medium)`,
						large: `var(--${prefix}-border-width-large)`,
						1: '1px',
						1.5: '1.5px',
						3: '3px',
						5: '5px',
					},
					boxShadow: {
						small: `var(--${prefix}-box-shadow-small)`,
						medium: `var(--${prefix}-box-shadow-medium)`,
						large: `var(--${prefix}-box-shadow-large)`,
					},
					backgroundImage: {
						'stripe-gradient':
              'linear-gradient(45deg, rgba(0, 0, 0, 0.1) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent)',
					},
					transitionDuration: {
						0: '0ms',
						250: '250ms',
						400: '400ms',
					},
					transitionTimingFunction: {
						'soft-spring': 'cubic-bezier(0.155, 1.105, 0.295, 1.12)',
					},
					...animations,
				},
			},
		},
	)
}
