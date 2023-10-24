import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import { Link } from 'react-router-dom'

import styles from './SignUpPage.module.css'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,
  headers:{
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
});

type Inputs = {
  name: string
  middleName: string
  lastName: string
  login: string
  password: string
}

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async ({
    name,
    middleName,
    lastName,
    login,
    password,
  }) => {

    const requestBody = {
      username: login,
      second_name: middleName,
      password: password,
      name: name,
      last_name: lastName,
    }

    try {
      // поменять УРЛ на урл локально развернутого бэка
      const response = await axiosInstance.post('/registration', requestBody)
      console.log(response)
    } catch (error) {
      console.error(error)
    }

    console.log(requestBody)
  }

  return (
  <body className = {styles.body}>
    <article className='container'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.SignUpPage}
        id='registration-form'
      >
        <h3 className='form__title'>Регистрация</h3>
        <label>
          <input
            {...register('name')}
            className='form__input'
            id='name'
            placeholder='Имя'
          />
        </label>
        <label>
          <input
            {...register('middleName')}
            className={styles.form__input}
            id='middlename'
            placeholder='Отчество'
          />
        </label>
        <label>
          <input
            {...register('lastName')}
            className='form__input'
            id='lastname'
            placeholder='Фамилия'
          />
        </label>
        <label>
          <input
            {...register('login')}
            className='form__input'
            id='login'
            placeholder='Логин'
          />
        </label>
        <label>
          <input
            {...register('password')}
            name='password'
            className='form__input'
            id='password'
            placeholder='Пароль'
          />
        </label>

        <button type='submit' className='form__btn_signup'>
          Зарегистрироваться
        </button>
      </form>
      <section className='block__item block-item'>
        <h2 className='block-item__title'>У вас уже есть аккаунт?</h2>
        <Link to='/sign-in' className='block-item__btn signin-btn'>Войти</Link>
      </section>
    </article>
  </body>
  )
}

export {
  SignUpPage,
}