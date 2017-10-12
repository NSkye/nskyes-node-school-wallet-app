import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PrepaidContract from './PrepaidContract';
import PrepaidSuccess from './PrepaidSuccess';

/**
 * Класс компонента Prepaid
 */
class Prepaid extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента Prepaid
	 */
	constructor(props) {
		super(props);

		this.state = {stage: 'contract', activeCardIndex: 0};
	}

	/**
	 * Обработка успешного платежа
	 * @param {Object} transaction данные о транзакции
	 */
	onPaymentSuccess(transaction) {
		const to = this.props.activeCard;
		const from = this.props.inactiveCardsList[this.state.activeCardIndex];
		const sum = transaction.sum;

		if (sum>from.balance) {
			alert("Оплата не произведена: недостаточно средств на счету!");
			throw new Error("Недостаточно средств на счету!");
		} else {
			fetch(`http://localhost:3000/cards/${from.id}/transfer`, {
				method: 'POST',
		 		headers: {
			 		"Content-type": "application/json"
		 		},
		 		body: JSON.stringify({
			    amount: sum,
					to: to.id,
					dataFrom: from.number,
					dataTo: to.number
			  })
			})
		  .then((response) => {
		    return response.json();
		  })
			.then((json) => {
					console.log(json);
					transaction.number = from.number;
					this.setState({
						stage: 'success',
						transaction
					});
				this.props.refreshData();
		  }).catch((ex) => {
		    console.log('Error', ex);
				alert("Ошибка. Платеж не был произведен.")
		  })
		}
	}

	setActiveCardIndex(index) {
		this.setState({
			activeCardIndex: index
		});
	}

	/**
	 * Повторить платеж
	 */
	repeatPayment() {
		this.setState({stage: 'contract'});
	}

	/**
	 * Функция отрисовки компонента
	 * @returns {JSX}
	 */
	render() {
		const {transaction} = this.state;
		const {activeCard, inactiveCardsList} = this.props;

		if (this.state.stage === 'success') {
			return (
				<PrepaidSuccess transaction={transaction} repeatPayment={() => this.repeatPayment()} />
			);
		}

		return (
			<PrepaidContract
				setActiveCardIndex = {this.setActiveCardIndex.bind(this)}
				activeCard={activeCard}
				inactiveCardsList={inactiveCardsList}
				onPaymentSuccess={(transaction) => this.onPaymentSuccess(transaction)} />
		);
	}
}

Prepaid.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.number
	}).isRequired,
	inactiveCardsList: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Prepaid;
