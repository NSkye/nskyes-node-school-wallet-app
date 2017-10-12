import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';
import MobilePaymentContract from './MobilePaymentContract';
import MobilePaymentSuccess from './MobilePaymentSuccess';

/**
 * Класс компонента MobilePayment
 */
class MobilePayment extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента MobilePayment
	 */
	constructor(props) {
		super(props);
		this.state = {stage: 'contract'};
	}

	/**
	 * Обработка успешного платежа
	 * @param {Object} transaction данные о транзакции
	 */
	onPaymentSuccess(transaction) {
		const sum = transaction.sum;
		const that = this;
		const success = null;
		const cardID = this.props.activeCard.id;
		const url = `http://localhost:3000/cards/${cardID}/pay`;
		fetch(url, {
			method: 'POST',
	 		headers: {
		 		"Content-type": "application/json"
	 		},
	 		body: JSON.stringify({
		    amount: sum,
		  })
		})
	  .then(function(response) {
	    return response.json();
	  }).then(function(json) {
	    console.log('parsed json', json);
			transaction.transactionID = json.id;
			transaction.sum = json.sum;
			transaction.phoneNumber = json.data;
			that.setState({
				stage: 'success',
				transaction
			});
			that.props.refreshData();
	  }).catch(function(ex) {
	    console.log('Error', ex);
			alert("Ошибка. Платеж не был произведен.")
	  })
	}

	/**
	 * Повторить платеж
	 */
	repeatPayment() {
		this.setState({stage: 'contract'});
	}

	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const {activeCard} = this.props;

		if (this.state.stage === 'success') {
			return (
				<MobilePaymentSuccess
					activeCard={activeCard}
					transaction={this.state.transaction}
					repeatPayment={() => this.repeatPayment()} />
			);
		}

		return (
			<MobilePaymentContract
				activeCard={activeCard}
				onPaymentSuccess={(transaction) => this.onPaymentSuccess(transaction)} />
		);
	}
}

MobilePayment.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.number,
		theme: PropTypes.object
	}).isRequired
};

export default MobilePayment;
