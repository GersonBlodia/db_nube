'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
 
import { Credentials, credentialsSchema, fullRegistrationSchema, PersonalInfo, personalInfoSchema, RegistrationData } from '@/schema/schema';
import { useRegistration } from '@/hooks/useHookForm';
import { ErrorMessage, SuccessMessage } from './StatusMessage';
import { PersonalInfoStep } from './PersonalInfoStep';
import { CredentialsStep } from './CredentialsStep';

 

const STEPS = [
  {
    id: 1,
    title: 'Información Personal',
    description: 'Datos básicos',
    schema: personalInfoSchema
  },
  {
    id: 2,
    title: 'Credenciales',
    description: 'Usuario y contraseña',
    schema: credentialsSchema
  }
] as const;

export default function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const { state, register: registerUser, clearError, clearSuccess } = useRegistration();

  // Formularios separados para cada paso
  const personalInfoForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange'
  });

  const credentialsForm = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    mode: 'onChange'
  });

  const currentStepInfo = STEPS.find(step => step.id === currentStep)!;
  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await personalInfoForm.trigger();
      if (isValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Validar credenciales y proceder con el registro
      const isCredentialsValid = await credentialsForm.trigger();
      if (isCredentialsValid) {
        await handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const personalData = personalInfoForm.getValues();
    const credentialsData = credentialsForm.getValues();

    // Combinar datos y validar con el esquema completo
    const fullData: RegistrationData = {
      ...personalData,
      username: credentialsData.username,
      contrasena: credentialsData.contrasena,
      tipoUsuarioId: credentialsData.tipoUsuarioId
    };

    const validation = fullRegistrationSchema.safeParse(fullData);
    
    if (!validation.success) {
      console.error('Validation errors:', validation.error);
      return;
    }

    await registerUser(validation.data);
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return personalInfoForm.formState.isValid;
    } else if (currentStep === 2) {
      return credentialsForm.formState.isValid;
    }
    return false;
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header con progreso */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Crear Cuenta
            </h1>
          </div>
          
          <p className="text-gray-600 mb-6">
            Paso {currentStep} de {STEPS.length}: {currentStepInfo.title}
          </p>

          {/* Barra de progreso */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-gray-200" />
            <div className="flex justify-between text-xs text-gray-500">
              {STEPS.map((step) => (
                <span key={step.id} className={clsx(
                  'transition-colors',
                  currentStep >= step.id ? 'text-indigo-600 font-medium' : 'text-gray-400'
                )}>
                  {step.description}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mensajes de estado */}
        <AnimatePresence mode="wait">
          {state.success && (
            <SuccessMessage
              show={state.success}
              onClose={clearSuccess}
              className="mb-6"
            />
          )}
          {state.error && (
            <ErrorMessage
              error={state.error}
              onClose={clearError}
              className="mb-6"
            />
          )}
        </AnimatePresence>

        {/* Contenido del paso actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {currentStep === 1 && (
              <PersonalInfoStep form={personalInfoForm} />
            )}
            {currentStep === 2 && (
              <CredentialsStep form={credentialsForm} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center mt-8"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || state.isLoading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={clsx(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  currentStep === step.id
                    ? 'bg-indigo-600 scale-125'
                    : currentStep > step.id
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!isStepValid() || state.isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {state.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {currentStep === STEPS.length ? 'Registrando...' : 'Procesando...'}
              </>
            ) : (
              <>
                {currentStep === STEPS.length ? 'Completar Registro' : 'Siguiente'}
                {currentStep < STEPS.length && <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a
              href="/auth/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Inicia sesión aquí
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}