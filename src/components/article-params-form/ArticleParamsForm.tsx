import { useState, useRef, useEffect, FormEvent } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentSettings: ArticleStateType;
	onApply: (settings: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentSettings,
	onApply,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] = useState<ArticleStateType>(currentSettings);
	const formRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (formRef.current && !formRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const handleToggleOpen = () => {
		setIsOpen((prev) => !prev);
	};

	const handleSelectChange =
		(key: keyof ArticleStateType) => (value: OptionType) => {
			setFormState((prev) => ({
				...prev,
				[key]: value,
			}));
		};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	const handleReset = (e: FormEvent) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	return (
		<div ref={formRef}>
			<ArrowButton isOpen={isOpen} onClick={handleToggleOpen} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задать параметры
					</Text>

					<Select
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleSelectChange('fontFamilyOption')}
						title='Шрифт'
					/>

					<RadioGroup
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={handleSelectChange('fontSizeOption')}
						title='Размер шрифта'
					/>

					<Select
						selected={formState.fontColor}
						options={fontColors}
						onChange={handleSelectChange('fontColor')}
						title='Цвет шрифта'
					/>

					<Separator />

					<Select
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={handleSelectChange('backgroundColor')}
						title='Цвет фона'
					/>

					<Select
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={handleSelectChange('contentWidth')}
						title='Ширина контента'
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
