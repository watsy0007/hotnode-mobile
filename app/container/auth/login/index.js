import React, { Component } from 'react'
import {
	Text,
	View,
	ScrollView,
	Button,
	Image,
	KeyboardAvoidingView
} from 'react-native'
import { createForm } from 'rc-form'
import { connect } from 'react-redux'
import AuthButton from 'component/auth/button'
import AuthInput from 'component/auth/input'
import styles from './style'

@connect()
@createForm()
class Login extends Component {
	handleOnSubmit = () => {
		this.props.form.validateFields((err, value) => {
			if (!err) {
				this.props.dispatch({
					type: 'login/login',
					payload: {
						...value
					}
				})
			}
		})
	}

	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form
		const account = getFieldValue('account')
		const password = getFieldValue('password')
		return (
			<ScrollView style={styles.container}>
				<KeyboardAvoidingView behavior="position">
					<Image style={styles.logo} source={require('asset/big_logo.png')} />
					<View style={{ marginTop: 55 }}>
						{getFieldDecorator('account', {
							rules: [{ required: true, message: '请输入邮箱账号' }]
						})(
							<AuthInput
								style={styles.input}
								title="账号"
								placeholder="请输入邮箱账号"
							/>
						)}
						{getFieldDecorator('password', {
							rules: [{ required: true, message: '请输入密码' }]
						})(
							<AuthInput
								style={[styles.input, { marginTop: 27 }]}
								title="密码"
								placeholder="请输入密码"
								inputProps={{ secureTextEntry: true }}
							/>
						)}
					</View>
					<AuthButton
						disabled={!account || !password}
						style={styles.button}
						onPress={this.handleOnSubmit}
					/>
				</KeyboardAvoidingView>
			</ScrollView>
		)
	}
}

export default Login
