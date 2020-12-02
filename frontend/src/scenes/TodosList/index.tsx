import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useModel } from '../../helpers/models'
import TodosModel from '../../models/todos'
import {
	BatchCheckbox,
	BatchCheckboxLabel,
	H1,
	MainSection,
	NewTodoInput,
	Section,
	Todo,
	TodoList,
	Toggle,
	ToggleLabel
} from './components'

export interface Todo {
	text: string
	createdTimestamp: string
	checked: boolean
}

const TodosList: React.FC = () => {
	const { t } = useTranslation()
	const {
		todos,
		loadingTodos,
		addTodo,
		fetchTodos,
		removeTodo,
		switchCheck
	} = useModel(TodosModel)

	useEffect(() => {
		fetchTodos()
	}, [])

	const todosList: Todo[] =
		todos === null
			? []
			: todos.sort(({ createdTimestamp: a }, { createdTimestamp: b }) =>
					a > b ? -1 : 1
			  )

	return (
		<>
			<Section>
				<header>
					<H1>{t('main.h1')}</H1>
					<NewTodoInput
						disabled={loadingTodos}
						onKeyUp={(e): void => {
							const text = e.currentTarget.value.trim()
							if (e.key === 'Enter' && text.length > 0) {
								addTodo(text)
								e.currentTarget.value = ''
							}
						}}
					/>
				</header>
				<MainSection>
					<BatchCheckbox id="batchcheckbox" type="checkbox" />
					<BatchCheckboxLabel />
					<TodoList>
						{todosList.map(({ checked, createdTimestamp, text }) => (
							<Todo key={createdTimestamp}>
								<div>
									<Toggle
										type="checkbox"
										checked={checked}
										onChange={(e): void => {
											if (e.currentTarget.checked !== checked) {
												switchCheck(createdTimestamp)
											}
										}}
									/>
									<ToggleLabel className={clsx({ checked })}>
										{text}
									</ToggleLabel>
									<button
										onClick={(): void => {
											removeTodo(createdTimestamp)
										}}
										className="destroy"
									/>
								</div>
							</Todo>
						))}
					</TodoList>
				</MainSection>
			</Section>
		</>
	)
}

export default TodosList
