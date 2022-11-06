import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

export default function ForgotPage() {
  const { forgotPassword, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const forgotResponse = await forgotPassword(data.get('email'))
      alert("If an account exists with the provided email, a reset link has been sent.")
      console.log(forgotResponse);
    }
    catch (error) {
      alert(error.message)
    }
  };

  const LoginNav = (e) => {
    e.preventDefault();
    navigate("/");
  }

  useEffect(() => {
    if (currentUser)
      navigate("/home");
  }, [currentUser, navigate])


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Reset Link
            </Button>

            <Grid container>
              <Grid item xs>
                <Link style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }} onClick={LoginNav} href="/" variant="body2">
                  Return to Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}