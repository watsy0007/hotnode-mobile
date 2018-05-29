import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, ViewPropTypes } from 'react-native'
import styles from './style'

class AuthInput extends PureComponent {
	static propTypes = {
		style: ViewPropTypes.style,
		title: PropTypes.string.isRequired,
		placeholder: PropTypes.string.isRequired,
		onChange: PropTypes.func,
		value: PropTypes.string,
		inputProps: PropTypes.object
	}

	render() {
		const {
			style,
			title,
			placeholder,
			onChange,
			value,
			inputProps
		} = this.props
		return (
			<View style={[style]}>
				<Text style={styles.title}>{title}</Text>
				<TextInput
					{...inputProps}
					style={styles.input}
					placeholder={placeholder}
					value={value}
					onChangeText={onChange}
					placeholderTextColor="#999999"
					underlineColorAndroid="transparent"
					clearButtonMode="while-editing"
				/>
			</View>
		)
	}
}

export default AuthInput