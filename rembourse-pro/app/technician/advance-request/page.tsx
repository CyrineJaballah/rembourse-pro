'use client'

import { useEffect, useState } from 'react'
import {
  submitAdvanceRequest,
  canRequestAdvance,
  getAdvanceRequests,
} from '@/app/actions/advance-requests'
import { t } from '@/lib/translations'
import useSWR, { mutate } from 'swr'
import {
  AlertCircle,
  CheckCircle,
  Send,
} from 'lucide-react'

type CanRequestResult = {
  allowed: boolean
  message: string
}

type AdvanceRequest = {
  id: string
  amount: string | number
  reason?: string | null
  rejectionReason?: string | null
  status: string
  requestedAt: string | Date
}

async function advancesFetcher() {
  return getAdvanceRequests()
}

export default function AdvanceRequestPage() {
  const {
    data: advanceRequests = [],
    isLoading,
  } = useSWR<AdvanceRequest[]>(
    '/api/advance-requests',
    advancesFetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const [checkingEligibility, setCheckingEligibility] =
    useState(true)

  const [canRequest, setCanRequest] =
    useState<CanRequestResult | null>(null)

  const [successMessage, setSuccessMessage] =
    useState('')

  const [errorMessage, setErrorMessage] =
    useState('')

  /*
   * Check if the technician is allowed
   * to request an advance.
   */
  const checkCanRequest = async () => {
    try {
      setCheckingEligibility(true)
      setErrorMessage('')

      const result =
        await canRequestAdvance()

      setCanRequest(result)
    } catch (error) {
      console.error(
        'Erreur lors de la vérification:',
        error
      )

      setErrorMessage(
        'Impossible de vérifier si vous pouvez demander un acompte.'
      )
    } finally {
      setCheckingEligibility(false)
    }
  }

  /*
   * Check eligibility when page loads.
   */
  useEffect(() => {
    checkCanRequest()
  }, [])

  /*
   * Submit advance request.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setSuccessMessage('')
    setErrorMessage('')

    const numericAmount = Number(amount)

    if (!amount || isNaN(numericAmount)) {
      setErrorMessage(
        'Veuillez saisir un montant valide.'
      )
      return
    }

    if (numericAmount <= 0) {
      setErrorMessage(
        'Le montant doit être supérieur à 0.'
      )
      return
    }

    if (!canRequest?.allowed) {
      setErrorMessage(
        canRequest?.message ||
          'Vous ne pouvez pas effectuer cette demande.'
      )
      return
    }

    setSubmitting(true)

    try {
      await submitAdvanceRequest(
        numericAmount,
        reason.trim()
      )

      setAmount('')
      setReason('')

      setSuccessMessage(
        "Demande d'acompte soumise avec succès !"
      )

      // Refresh request history
      await mutate(
        '/api/advance-requests'
      )

      // Re-check whether another request
      // can be submitted
      await checkCanRequest()

      setTimeout(() => {
        setSuccessMessage('')
      }, 4000)
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de l'acompte:",
        error
      )

      const message =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la soumission de la demande."

      setErrorMessage(message)
    } finally {
      setSubmitting(false)
    }
  }

  /*
   * Format date.
   */
  const formatDate = (
    date: string | Date
  ) => {
    return new Date(date).toLocaleDateString(
      'fr-FR',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  /*
   * Format currency.
   */
  const formatCurrency = (
    value: string | number
  ) => {
    return new Intl.NumberFormat(
      'fr-FR',
      {
        style: 'currency',
        currency: 'EUR',
      }
    ).format(Number(value))
  }

  /*
   * Status colors.
   */
  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case 'approved':
        return `
          border-green-200
          bg-green-50
          text-green-700
          dark:border-green-800
          dark:bg-green-950/30
          dark:text-green-400
        `

      case 'rejected':
        return `
          border-red-200
          bg-red-50
          text-red-700
          dark:border-red-800
          dark:bg-red-950/30
          dark:text-red-400
        `

      default:
        return `
          border-yellow-200
          bg-yellow-50
          text-yellow-700
          dark:border-yellow-800
          dark:bg-yellow-950/30
          dark:text-yellow-400
        `
    }
  }

  /*
   * Get translated status.
   */
  const getStatusLabel = (
    status: string
  ) => {
    return t(
      `status.${status}` as any
    )
  }

  return (
    <div
      className="
        min-h-screen
        w-full
        min-w-0
        bg-background
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          min-w-0
          p-4
          sm:p-6
          lg:p-8
        "
      >
        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-6 sm:mb-8">
          <h1
            className="
              text-2xl
              font-bold
              tracking-tight
              text-foreground
              sm:text-3xl
            "
          >
            {t('tech.advance.title')}
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              text-muted-foreground
              sm:text-base
            "
          >
            Effectuez une demande d'acompte
            et consultez l'historique de vos
            demandes.
          </p>
        </div>

        {/* =====================================
            RESPONSIVE GRID
        ====================================== */}

        <div
          className="
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-6
            lg:grid-cols-3
            lg:gap-8
          "
        >
          {/* =====================================
              REQUEST FORM
          ====================================== */}

          <section
            className="
              h-fit
              min-w-0
              rounded-xl
              border
              border-border
              bg-card
              p-4
              shadow-sm
              sm:p-6
              lg:col-span-1
            "
          >
            <div className="mb-6">
              <h2
                className="
                  text-lg
                  font-semibold
                  text-foreground
                "
              >
                Nouvelle demande
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Remplissez les informations
                nécessaires.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Eligibility */}
              {checkingEligibility ? (
                <div
                  className="
                    rounded-lg
                    border
                    border-border
                    bg-secondary/50
                    p-4
                    text-sm
                    text-muted-foreground
                  "
                >
                  Vérification de votre
                  éligibilité...
                </div>
              ) : (
                canRequest && (
                  <div
                    className={`
                      flex
                      items-start
                      gap-3
                      rounded-lg
                      border
                      p-4
                      text-sm
                      ${
                        canRequest.allowed
                          ? `
                            border-green-200
                            bg-green-50
                            text-green-700
                            dark:border-green-800
                            dark:bg-green-950/30
                            dark:text-green-400
                          `
                          : `
                            border-yellow-200
                            bg-yellow-50
                            text-yellow-700
                            dark:border-yellow-800
                            dark:bg-yellow-950/30
                            dark:text-yellow-400
                          `
                      }
                    `}
                  >
                    {canRequest.allowed ? (
                      <CheckCircle
                        className="
                          mt-0.5
                          h-5
                          w-5
                          shrink-0
                        "
                      />
                    ) : (
                      <AlertCircle
                        className="
                          mt-0.5
                          h-5
                          w-5
                          shrink-0
                        "
                      />
                    )}

                    <p>
                      {canRequest.message}
                    </p>
                  </div>
                )
              )}

              {/* Success */}
              {successMessage && (
                <div
                  role="status"
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-lg
                    border
                    border-green-200
                    bg-green-50
                    p-4
                    text-sm
                    text-green-700
                    dark:border-green-800
                    dark:bg-green-950/30
                    dark:text-green-400
                  "
                >
                  <CheckCircle
                    className="
                      mt-0.5
                      h-5
                      w-5
                      shrink-0
                    "
                  />

                  <span>
                    {successMessage}
                  </span>
                </div>
              )}

              {/* Error */}
              {errorMessage && (
                <div
                  role="alert"
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    p-4
                    text-sm
                    text-red-700
                    dark:border-red-800
                    dark:bg-red-950/30
                    dark:text-red-400
                  "
                >
                  <AlertCircle
                    className="
                      mt-0.5
                      h-5
                      w-5
                      shrink-0
                    "
                  />

                  <span>
                    {errorMessage}
                  </span>
                </div>
              )}

              {/* Amount */}
              <div>
                <label
                  htmlFor="advance-amount"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  {t(
                    'tech.advance.amount'
                  )}
                </label>

                <div className="relative">
                  <input
                    id="advance-amount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                    placeholder="Exemple: 350.00"
                    disabled={
                      checkingEligibility ||
                      submitting ||
                      !canRequest?.allowed
                    }
                    className="
                      min-h-[48px]
                      w-full
                      rounded-lg
                      border
                      border-border
                      bg-secondary
                      px-4
                      py-3
                      pr-10
                      text-foreground
                      outline-none
                      transition
                      placeholder:text-muted-foreground
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/20
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  />

                  <span
                    className="
                      pointer-events-none
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      text-muted-foreground
                    "
                  >
                    €
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Indiquez le montant souhaité (ex: 350,00 € pour grand déplacement).
                </p>
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="advance-reason"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  {t(
                    'tech.advance.reason'
                  )}
                </label>

                <textarea
                  id="advance-reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(
                      event.target.value
                    )
                  }
                  placeholder="Exemple: Acompte frais de route & hébergement pour mission 15 Rue Exemple, Paris"
                  rows={4}
                  disabled={
                    checkingEligibility ||
                    submitting ||
                    !canRequest?.allowed
                  }
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-border
                    bg-secondary
                    px-4
                    py-3
                    text-foreground
                    outline-none
                    transition
                    placeholder:text-muted-foreground
                    focus:border-primary
                    focus:ring-2
                    focus:ring-primary/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Précisez le motif professionnel justifiant cet acompte.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  submitting ||
                  checkingEligibility ||
                  !canRequest?.allowed ||
                  !amount
                }
                className="
                  flex
                  min-h-[48px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-primary
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-primary-foreground
                  transition
                  hover:opacity-90
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  focus-visible:ring-offset-2
                "
              >
                <Send className="h-4 w-4" />

                {submitting
                  ? 'Envoi en cours...'
                  : t(
                      'tech.advance.submit'
                    )}
              </button>
            </form>
          </section>

          {/* =====================================
              REQUEST HISTORY
          ====================================== */}

          <section
            className="
              min-w-0
              rounded-xl
              border
              border-border
              bg-card
              p-4
              shadow-sm
              sm:p-6
              lg:col-span-2
            "
          >
            <div className="mb-6">
              <h2
                className="
                  text-lg
                  font-semibold
                  text-foreground
                "
              >
                {t(
                  'tech.advance.history'
                )}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Consultez l'état de vos
                demandes d'acompte.
              </p>
            </div>

            {/* Loading */}
            {isLoading && (
              <div
                className="
                  flex
                  min-h-[200px]
                  items-center
                  justify-center
                "
              >
                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  {t('common.loading')}
                </p>
              </div>
            )}

            {/* Empty */}
            {!isLoading &&
              advanceRequests.length === 0 && (
                <div
                  className="
                    flex
                    min-h-[200px]
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-border
                    p-8
                    text-center
                  "
                >
                  <p
                    className="
                      text-sm
                      font-medium
                      text-foreground
                    "
                  >
                    Aucune demande
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Vos demandes d'acompte
                    apparaîtront ici.
                  </p>
                </div>
              )}

            {/* Request list */}
            {!isLoading &&
              advanceRequests.length > 0 && (
                <div className="space-y-4">
                  {advanceRequests.map(
                    (request) => (
                      <div
                        key={request.id}
                        className="
                          min-w-0
                          rounded-xl
                          border
                          border-border
                          bg-background
                          p-4
                          transition
                          hover:bg-secondary/30
                          sm:p-5
                        "
                      >
                        {/* Top row */}
                        <div
                          className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                          "
                        >
                          <div className="min-w-0">
                            <p
                              className="
                                text-xs
                                text-muted-foreground
                                sm:text-sm
                              "
                            >
                              {t(
                                'tech.advance.requested-at'
                              )}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-muted-foreground
                                sm:text-sm
                              "
                            >
                              {formatDate(
                                request.requestedAt
                              )}
                            </p>
                          </div>

                          <span
                            className={`
                              inline-flex
                              w-fit
                              max-w-full
                              shrink-0
                              rounded-full
                              border
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusColor(
                                request.status
                              )}
                            `}
                          >
                            {getStatusLabel(
                              request.status
                            )}
                          </span>
                        </div>

                        {/* Amount */}
                        <p
                          className="
                            mt-4
                            text-2xl
                            font-bold
                            text-primary
                            sm:text-3xl
                          "
                        >
                          {formatCurrency(
                            request.amount
                          )}
                        </p>

                        {/* Reason */}
                        {request.reason && (
                          <div className="mt-3">
                            <p
                              className="
                                text-xs
                                font-medium
                                text-muted-foreground
                              "
                            >
                              Motif
                            </p>

                            <p
                              className="
                                mt-1
                                break-words
                                text-sm
                                text-foreground
                              "
                            >
                              {request.reason}
                            </p>
                          </div>
                        )}

                        {/* Rejection reason */}
                        {request.rejectionReason && (
                          <div
                            className="
                              mt-4
                              rounded-lg
                              border
                              border-red-200
                              bg-red-50
                              p-3
                              text-sm
                              text-red-700
                              dark:border-red-800
                              dark:bg-red-950/30
                              dark:text-red-400
                            "
                          >
                            <p className="font-semibold">
                              Motif du rejet :
                            </p>

                            <p className="mt-1 break-words">
                              {
                                request.rejectionReason
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
          </section>
        </div>
      </div>
    </div>
  )
}