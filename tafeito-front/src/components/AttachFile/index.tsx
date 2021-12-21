import React, {useEffect} from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAxios } from '../../hooks/useAxios';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import {Anexo} from '../../common/types';

type AttachFileProps = {
  anexo: Anexo;
  taskId: number;
  updateTasks: () => void;
}

type ResponsePatchAnexo = {
}

type ResponseGetAttachedFile = Blob;



  const AttachFile = (props: AttachFileProps) => {
  const { taskId, anexo, updateTasks } = props;

  const {
    commit: commitDownloadAnexo,
    response,
    loading
  } = useAxios<ResponseGetAttachedFile>({
    method: 'GET',
    path: `tarefas/${taskId}/anexos/${anexo.id}`
  });

  const {
    commit: commitDeleteAnexo
  } = useAxios<ResponsePatchAnexo>({
    method: 'DELETE',
    path: `tarefas/${taskId}/anexos/${anexo.id}`
  });

  useEffect(() => {
    if(response && !loading) {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', anexo.nome);
      document.body.appendChild(link);
      link.click();
    }
  }, [response, loading]);

  const downloadAnexo = () => {
    commitDownloadAnexo(
      undefined,
      undefined,
      undefined,
      'blob'
    );
  };

  const deleteAnexo = (anexoId: number) => {
    commitDeleteAnexo({}, updateTasks, `tarefas/${taskId}/anexos/${anexoId}`)
  }
  
  return (
      <div>
      <ListItemButton sx={{ pl: 4 }} >
        <ListItemText primary={anexo.nome} onClick={() => { downloadAnexo() }} />
        <Tooltip title='Excluir anexo'>
          <IconButton edge="end" aria-label="excluir" onClick={() => { deleteAnexo(anexo.id) }}>
            <Delete />
          </IconButton>
        </Tooltip>
      </ListItemButton>
    </div>
  )
}

export default AttachFile;