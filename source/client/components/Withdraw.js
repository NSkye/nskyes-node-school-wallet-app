import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

import {Card, Title, Button, Island, Input} from './';

const WithdrawTitle = styled(Title)`
	text-align: center;
`;

const WithdrawLayout = styled(Island)`
	width: 440px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const InputField = styled.div`
	margin: 20px 0;
	position: relative;
`;

const SumInput = styled(Input)`
	max-width: 200px;
	padding-right: 20px;
	background-color: rgba(0, 0, 0, 0.08);
	color: '#000';
`;

const Currency = styled.span`
	font-size: 12px;
	position: absolute;
	right: 10;
	top: 8px;
`;

/**
 * Класс компонента Withdraw
 */
class Withdraw extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента Withdraw
	 */
	constructor(props) {
		super(props);

		this.state = {
			selectedCard: props.inactiveCardsList[0],
			sum: 0
		};
	}

	/**
	 * Обработка изменения значения в input
	 * @param {Event} event событие изменения значения input
	 */
	onChangeInputValue(event) {
		if (!event) {
			return;
		}

		const {name, value} = event.target;

		this.setState({
			[name]: value
		});

		console.log("State", this.state);
		console.log("activeCard", this.props.activeCard);
	}

	/**
	 * Отправка формы
	 * @param {Event} event событие отправки формы
	 */
	onSubmitForm(event) {
		if (event) {
			event.preventDefault();
		}
		const to = this.state.selectedCard;
		const from = this.props.activeCard;

		const {sum} = this.state;

		const isNumber = !isNaN(parseFloat(sum)) && isFinite(sum);
		if (!isNumber || sum <= 0) {
			return;
		}

		if (sum>from.balance) {
			alert("Оплата не произведена: недостаточно средств на счету!");
			throw new Error("Недостаточно средств на счету!");
		} else {
			fetch(`https://localhost:3000/cards/${from.id}/transfer`, {
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
					this.setState({sum: 0});
					this.props.refreshData();
		  }).catch((ex) => {
		    console.log('Error', ex);
				alert("Ошибка. Платеж не был произведен.")
		  })
		}


	}

	/**
	 * Функция отрисовки компонента
	 * @returns {JSX}
	 */
	render() {
		const {inactiveCardsList} = this.props;

		return (
			<form onSubmit={(event) => this.onSubmitForm(event)}>
				<WithdrawLayout>
					<WithdrawTitle>Вывести деньги на карту</WithdrawTitle>
					<Card type='select' data={inactiveCardsList} />
					<InputField>
						<SumInput
							name='sum'
							value={this.state.sum}
							onChange={(event) => this.onChangeInputValue(event)} />
						<Currency>₽</Currency>
					</InputField>
					<Button type='activeCardsubmit'>Перевести</Button>
				</WithdrawLayout>
			</form>
		);
	}
}

Withdraw.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.number,
		theme: PropTypes.object
	}).isRequired,
	inactiveCardsList: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Withdraw;
