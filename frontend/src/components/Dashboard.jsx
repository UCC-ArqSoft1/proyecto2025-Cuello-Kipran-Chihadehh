import api from '../services/api';

useEffect(() => {
  api.get('/users')
    .then((res) => {
      setUsers(res.data);
    })
    .catch((err) => console.error(err));
}, []);
