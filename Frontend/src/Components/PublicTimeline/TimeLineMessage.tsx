import React, { FC, Fragment, useEffect, useState } from 'react';
import { Message } from '../../Types/Timeline';
import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';
import { IsLoading, User } from '../../Types/Global';
import axios, { AxiosError } from 'axios';

interface props {
	message: Message;
}

const TimeLineMessage: FC<props> = ({ message }) => {
	const [user, setUser] = useState({} as User);
	const [isLoading, setIsLoading] = useState({ isLoading: true, error: null } as IsLoading);

	const style = {
		container: {
			border: '1px solid grey',
			borderRadius: '4px',
			margin: '4px 0',
			boxSizing: 'border-box',
			boxShadow: '0 0 3px 0px #888888aa',
		},
		content: {
			display: 'flex',
			flexDirection: 'column',
		},
		text: {
			display: 'block',
		},
		date: {
			fontSize: '0.7rem',
			color: 'grey',
			display: 'block',
		},
	};

	const date = new Date(message.pubDate);

	useEffect(() => {
		const getUser = async () => {
			try {
				const url = `${process.env.REACT_APP_API_URL}/user?id=${message.authorId}`;
				const response = await axios.get(url, {
					headers: {
						'access-control-allow-origin': '*',
					},
				});
				setUser(response.data.value);
				setIsLoading({ isLoading: false, error: null });
			} catch (e: any) {
				if (e instanceof AxiosError) {
					console.log(e);
					setIsLoading({ isLoading: false, error: e.message });
				} else {
					console.log(e);
					setIsLoading({ isLoading: false, error: 'Something went wrong!' });
				}
			}
		};
		getUser();
	}, []);

	if (isLoading.isLoading && isLoading.error === null) {
		return <div>Loading...</div>;
	} else if (isLoading.error !== null) {
		return <div>Error: {isLoading.error}</div>;
	}

	return (
		<ListItem alignItems="flex-start" sx={style.container}>
			<ListItemAvatar>
				<Avatar alt="Kusmar00" src="" />
			</ListItemAvatar>
			<ListItemText
				primary={<Typography variant="h6">{user.username}</Typography>}
				secondary={
					<Fragment>
						<Typography component="span" variant="body2" color="text.primary" sx={style.text}>
							{message.text}
						</Typography>
						<Typography component="span" variant="body2" color="text.primary" sx={style.date}>
							{date.toLocaleString()}
						</Typography>
					</Fragment>
				}
			/>
		</ListItem>
	);
};

export default TimeLineMessage;
