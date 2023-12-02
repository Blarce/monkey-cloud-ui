import React, { useEffect } from 'react'
import {
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Checkbox,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { axiosInstance } from '../../api'
import styles from './FilesList.module.scss'
import { useMenus } from '../../hooks/useMenus'
import { useGetFilesQuery, useLazyGetFilesQuery } from '../../store/filesSlice'
import { IFile } from '../../store/types'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { Link, useParams } from 'react-router-dom'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const FilesList = ({
  setCurrentPath, // files,
} // setFiles,
: {
  setCurrentPath: (currentPath: string) => void
}) => {
  const { path } = useParams()
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  //const { data, error, isLoading } = useGetFilesQuery(path || '')
  const [triggerGetFiles, result, lastPromiseInfo] = useLazyGetFilesQuery()
  const { data } = result
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { menus, setMenus } = useMenus()
  const open = Boolean(anchorEl)
  const [openModal, setOpen] = React.useState(false)
  const username = localStorage.getItem('username')

  useEffect(() => {
    triggerGetFiles('')
  }, [])

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false)
  const handleClick =
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextMenus = menus
      // @ts-ignore
      nextMenus[index] = true
      setMenus(nextMenus)
      setAnchorEl(event.currentTarget)
    }

  const FavoriteFileRequest =
    (file: IFile, label: any, index: number) => async () => {
      if (file.isFavorite) {
        label = { inputProps: { 'aria-label': 'Checkbox demo' } }
      } else {
        try {
          const response = await axiosInstance.post('/addToFavorite', {
            username: username,
            // @ts-ignore
            fullPath: '333.png',
          })
          console.log(response)
        } catch (error) {
          console.error(error)
        }
      }
    }

  const handleTableRowClick = (file: IFile) => async () => {
    // let headerPath = ''
    // if (file.breadCrums === username) {
    //   headerPath = ''
    // } else {
    //   headerPath = file.breadCrums
    // }
    // console.log(headerPath)
    if (file.isDir) {
      await triggerGetFiles('123/')
    }
    console.log(result)
    // const response = await axiosInstance.get('/getFiles', {
    //   params: {
    //     username: localStorage.getItem('username'),
    //     folder: '123/',
    //   },
    // })
    setCurrentPath(file.breadCrums)
    // // console.log(response)
    // const menus = response.data.list.map((m: any) => false)
    // setMenus(menus)
  }
  //@ts-ignore
  // const GetFilesFromFolder = (index: number) => async () => {
  //   if (files[index].)
  // }

  const handleMenuClose = (index: number) => () => {
    const nextMenus = menus
    // @ts-ignore
    nextMenus[index] = false
    setMenus(nextMenus)
    setAnchorEl(null)
  }

  const handleMenuCloseForDelete = (index: number) => async () => {
    // @ts-ignore
    if (data.list[index].isDir === true) {
      try {
        const response = await axiosInstance.delete('/deleteFolder', {
          params: {
            username: username,
            // @ts-ignore
            fullPath: data.list[index].path,
          },
        })
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const response = await axiosInstance.delete('/deleteFile', {
          params: {
            username: username,
            //@ts-ignore
            fullPath: data.list[index].path,
          },
        })
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
    handleMenuClose(index)
  }

  const responseForRenameFile = (index: number) => async () => {
    const renameFile = document.getElementById('rename') as HTMLInputElement
    //@ts-ignore
    const fileName = data.list[index].name
    const extension = fileName.substring(fileName.lastIndexOf('.'))
    //@ts-ignore
    const path = data.list[index].breadCrums
    let cutPath = ''
    //@ts-ignore
    if (data.list[index].breadCrums === localStorage.getItem('username')) {
      cutPath = ''
    } else {
      cutPath = path.substring(path.indexOf('/') + 1) + '/'
    }
    //@ts-ignore
    if (data.list[index].isDir === true) {
      try {
        const response = await axiosInstance.put('/renameFolder', {
          username: username,
          fullPath: cutPath,
          //@ts-ignore
          oldName: data.list[index].name,
          //TODO Нельзя давать пользователю ставить расширешние (.) в название папки P.S Запретить пользователю использовать точку.
          newName: renameFile.value,
        })
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const response = await axiosInstance.put('/renameFile', {
          username: username,
          fullPath: cutPath,
          //@ts-ignore
          oldName: data.list[index].name,
          //TODO Нельзя давать пользователю менять расширение файла
          //@ts-ignore
          newName: renameFile.value + extension,
        })
        //@ts-ignore
        data.list[index].name = renameFile.value + extension
      } catch (error) {
        console.error(error)
      }
    }
    handleClose()
  }
  if (!data?.list.length) {
    return <div>Папка пуста. Загрузите файлы.</div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IFile, index: number) => (
            <TableRow
              //Поставить on click и проверить is dir //set files // вызывать функцию
              key={file.name}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                verticalAlign: 'baseline',
              }}
            >
              <Container
                onClick={handleTableRowClick(file)}
                className={styles.TableRowInnerContainer}
              >
                {file.isDir ? <FolderIcon /> : <PictureAsPdfIcon />}
                <TableCell component='th' scope='row'>
                  {file.name}
                </TableCell>
                <TableCell align='left'>{file.username}</TableCell>
                {/*<TableCell align='left'>{file.data}</TableCell>*/}
                {file.isDir !== true ? (
                  <TableCell align='left'>{file.size}</TableCell>
                ) : (
                  <TableCell align='left'>‒</TableCell>
                )}
              </Container>
              <Container>
                <Checkbox
                  //@ts-ignore
                  onClick={FavoriteFileRequest(index)}
                  className={styles.TableRowInnerFavorite}
                  {...label}
                  id='favorite'
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                />
              </Container>
              <TableCell align='right'>
                <IconButton
                  id='basic-button'
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick(index)}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  onClick={(event) => console.log(event)}
                  id='basic-menu'
                  anchorEl={anchorEl}
                  open={menus[index]}
                  onClose={handleMenuClose(index)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {file.isDir ? (
                    <MenuItem onClick={handleMenuClose(index)}>
                      Поделиться
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={handleMenuClose(index)}>
                      Скачать
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleOpen}>Переименовать</MenuItem>
                  <MenuItem onClick={handleMenuCloseForDelete(index)}>
                    Удалить
                  </MenuItem>
                  <Modal
                    open={openModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'
                  >
                    <Box sx={style}>
                      <Typography
                        id='modal-modal-title'
                        variant='h6'
                        component='h2'
                      >
                        Переименовать
                      </Typography>
                      <TextField fullWidth id='rename' />
                      <Button onClick={handleClose} variant='text'>
                        Отмена
                      </Button>
                      <Button
                        //@ts-ignore
                        onClick={responseForRenameFile(index)}
                        type='submit'
                        variant='contained'
                      >
                        Ок
                      </Button>
                    </Box>
                  </Modal>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { FilesList }
//handleMenuCloseForRename(index)
