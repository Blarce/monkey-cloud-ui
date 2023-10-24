import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from './SignInPage.module.css'
import {SiSurveymonkey} from 'react-icons/si'
import {BiSolidLockAlt} from 'react-icons/bi'
import {useState} from "react";
import {link} from "fs/promises";
//const [login, setLogin] = useState('')
//const [password, setPassword] = useState('')
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,
  headers:{
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
});

type Inputs = {

  login: string
  password: string
}

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async ({ login, password }) => {
    const requestBody = {
      username: login,
      password: password,
    }

    try {
      // поменять УРЛ на урл локально развернутого бэка
      const response = await axiosInstance.post('/login', requestBody)
      console.log(response)
    } catch (error) {
      console.error(error)
    }

    console.log(requestBody)
  }
  return (
    <div className={styles.signIn_section}>
      <div className={styles.formBox}>
        <form
            onSubmit={handleSubmit(onSubmit)}
            id='signIn-form'
            action=''
        >
          <h2>Вход</h2>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <SiSurveymonkey />
            </span>
            <input
                {...register('login')}
                type='text' required
                id='login'
                pattern='^[a-zA-Z0-9_.-]*$'
            />
            <label>Логин</label>
          </div>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <BiSolidLockAlt />
            </span>
            <input
              {...register('password')}
              type='password'
              required
              id='password'
              pattern='^[a-zA-Z0-9_.-]*$'
            />
            <label>Пароль</label>
          </div>
          <button className={styles.signInButton}>
            <Link to='/main'
                  type='submit'>
              Вход
            </Link>
          </button>
          <div className={styles.createAccount}>
            <p>
              Нет аккаунта?
              <a> </a>
              <a>
                <Link to='/sign-up'>
                   Зарегестрироваться
                </Link>
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
export {
  SignInPage,
}