import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import SignInWith from '@/components/SignInWith';

// Updated schema to include role
const signUpSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password should be at least 8 characters long'),
  role: z.enum(['admin', 'client']),
});

type SignUpFields = z.infer<typeof signUpSchema>;

const mapClerkErrorToFormField = (error: any) => {
  switch (error.meta?.paramName) {
    case 'email_address':
      return 'email';
    case 'password':
      return 'password';
    default:
      return 'root';
  }
};

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'client', // Default role
    },
  });

  const { signUp, isLoaded } = useSignUp();
  const selectedRole = watch('role');

  const onSignUp = async (data: SignUpFields) => {
    if (!isLoaded) return;

    try {
      console.log('Sign up data: ', data);

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        unsafeMetadata: {
          role: data.role,
        },

      });

      await signUp.update({
        unsafeMetadata: {
          role: data.role,
        },
      });

      await signUp.prepareVerification({ strategy: 'email_code' });

      router.push('/verify');
    } catch (err) {
      console.log('Sign up error: ', err);
      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          console.log('Error: ', JSON.stringify(error, null, 2));
          const fieldName = mapClerkErrorToFormField(error);
          console.log('Field name: ', fieldName);
          setError(fieldName, {
            message: error.longMessage,
          });
        });
      } else {
        setError('root', { message: 'Unknown error' });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Create an account</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name='email'
          placeholder='Email'
          autoFocus
          autoCapitalize='none'
          keyboardType='email-address'
          autoComplete='email'
        />

        <CustomInput
          control={control}
          name='password'
          placeholder='Password'
          secureTextEntry
        />

        {/* Role selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Select your role:</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'client' && styles.selectedRoleButton,
              ]}
              onPress={() => setValue('role', 'client')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === 'client' && styles.selectedRoleButtonText,
                ]}
              >
                Client
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'admin' && styles.selectedRoleButton,
              ]}
              onPress={() => setValue('role', 'admin')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === 'admin' && styles.selectedRoleButtonText,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {errors.root && (
          <Text style={{ color: 'crimson' }}>{errors.root.message}</Text>
        )}
      </View>

      <CustomButton text='Sign up' onPress={handleSubmit(onSignUp)} />
      <Link href='/sign-in' style={styles.link}>
        Already have an account? Sign in
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  form: {
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  link: {
    color: '#4353FD',
    fontWeight: '600',
  },
  roleContainer: {
    marginVertical: 10,
  },
  roleLabel: {
    marginBottom: 8,
    fontSize: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedRoleButton: {
    borderColor: '#4353FD',
    backgroundColor: '#4353FD20',
  },
  roleButtonText: {
    color: '#333',
  },
  selectedRoleButtonText: {
    color: '#4353FD',
    fontWeight: '600',
  },
});