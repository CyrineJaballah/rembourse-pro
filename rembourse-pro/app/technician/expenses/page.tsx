'use client'

import { useRef, useState } from 'react'
import { submitExpense, getExpenses } from '@/app/actions/expenses'
import { t } from '@/lib/translations'
import useSWR, { mutate } from 'swr'
import {
  Upload,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react'

const CATEGORIES = [
  {
    value: 'travel',
    label: t('category.travel'),
  },
  {
    value: 'accommodation',
    label: t('category.accommodation'),
  },
  {
    value: 'meals',
    label: t('category.meals'),
  },
  {
    value: 'equipment',
    label: t('category.equipment'),
  },
  {
    value: 'tools',
    label: t('category.tools'),
  },
  {
    value: 'other',
    label: t('category.other'),
  },
]

type Expense = {
  id: string
  amount: string | number
  category: string
  description?: string | null
  createdAt: string | Date
  status: string
  receiptUrl?: string | null
}

type FormData = {
  amount: string
  category: string
  description: string
  receiptUrl: string
}

async function fetcher() {
  return getExpenses()
}

export default function ExpensesPage() {
  const {
    data: expenses = [],
    isLoading,
  } = useSWR<Expense[]>(
    '/api/expenses',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [formData, setFormData] =
    useState<FormData>({
      amount: '',
      category: 'travel',
      description: '',
      receiptUrl: '',
    })

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [submitting, setSubmitting] =
    useState(false)

  const [successMessage, setSuccessMessage] =
    useState('')

  const [errorMessage, setErrorMessage] =
    useState('')

  /*
   * Update one form field.
   */
  const updateFormData = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  /*
   * Handle receipt selection.
   *
   * IMPORTANT:
   * This currently only selects the file locally.
   * The actual upload to storage needs to be connected
   * to your backend/storage system.
   */
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ]

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        'Veuillez sélectionner une image ou un fichier PDF.'
      )

      event.target.value = ''
      return
    }

    const maxSize = 10 * 1024 * 1024

    if (file.size > maxSize) {
      setErrorMessage(
        'Le fichier ne doit pas dépasser 10 Mo.'
      )

      event.target.value = ''
      return
    }

    setErrorMessage('')
    setSelectedFile(file)
  }

  /*
   * Remove selected receipt.
   */
  const removeSelectedFile = () => {
    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /*
   * Submit expense.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setSuccessMessage('')
    setErrorMessage('')

    const amount = Number(formData.amount)

    if (!formData.amount || isNaN(amount)) {
      setErrorMessage(
        'Veuillez saisir un montant valide.'
      )
      return
    }

    if (amount <= 0) {
      setErrorMessage(
        'Le montant doit être supérieur à 0.'
      )
      return
    }

    setSubmitting(true)

    try {
      await submitExpense({
        amount,
        category: formData.category,
        description: formData.description,
        receiptUrl: formData.receiptUrl,
      })

      setFormData({
        amount: '',
        category: 'travel',
        description: '',
        receiptUrl: '',
      })

      removeSelectedFile()

      setSuccessMessage(
        'Dépense soumise avec succès !'
      )

      await mutate('/api/expenses')

      setTimeout(() => {
        setSuccessMessage('')
      }, 4000)
    } catch (error) {
      console.error(
        'Erreur lors de la soumission :',
        error
      )

      setErrorMessage(
        'Une erreur est survenue lors de la soumission de la dépense. Veuillez réessayer.'
      )
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
      }
    )
  }

  /** Format currency.
   */
  const formatCurrency = (
    amount: string | number
  ) => {
    const numericAmount =
      Number(amount)

    return new Intl.NumberFormat(
      'fr-FR',
      {
        style: 'currency',
        currency: 'EUR',
      }
    ).format(numericAmount)
  }

  /** Status styles.*/
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
   * Status label.
   */
  const getStatusLabel = (
    status: string
  ) => {
    try {
      return t(
        `status.${status}` as any
      )
    } catch {
      return status
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          p-4
          sm:p-6
          lg:p-8
        "
      >
        {/* =================================
            PAGE HEADER
        ================================== */}

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
            {t('tech.expenses.title')}
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
              sm:text-base
            "
          >
            Déclarez vos dépenses et suivez
            leur statut.
          </p>
        </div>

        {/* =================================
            MAIN GRID
        ================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-3
            lg:gap-8
          "
        >
          {/* =================================
              EXPENSE FORM
          ================================== */}

          <section
            className="
              h-fit
              rounded-xl
              border
              border-border
              bg-card
              p-4
              shadow-sm
              sm:p-6
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
                Nouvelle dépense
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Remplissez les informations
                de votre dépense.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
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
                  <CheckCircle2
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
                  htmlFor="amount"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  {t(
                    'tech.expenses.amount'
                  )}
                </label>

                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.amount}
                    onChange={(event) =>
                      updateFormData(
                        'amount',
                        event.target.value
                      )
                    }
                    placeholder="Exemple: 45.50"
                    className="
                      min-h-[48px]
                      w-full
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
                  Indiquez le montant exact figurant sur votre justificatif TTC.
                </p>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  {t(
                    'tech.expenses.category'
                  )}
                </label>

                <select
                  id="category"
                  value={formData.category}
                  onChange={(event) =>
                    updateFormData(
                      'category',
                      event.target.value
                    )
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
                    text-foreground
                    outline-none
                    transition
                    focus:border-primary
                    focus:ring-2
                    focus:ring-primary/20
                  "
                >
                  {CATEGORIES.map(
                    (category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    )
                  )}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sélectionnez la catégorie TARCOM correspondant à vos frais.
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  {t(
                    'tech.expenses.description'
                  )}
                </label>

                <textarea
                  id="description"
                  value={
                    formData.description
                  }
                  onChange={(event) =>
                    updateFormData(
                      'description',
                      event.target.value
                    )
                  }
                  placeholder="Exemple: Carburant & péage intervention Ref #23517560 à Paris"
                  rows={4}
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
                  "
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Indiquez la référence d&apos;intervention ou le motif professionnel.
                </p>
              </div>

              {/* Receipt Upload */}
              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  {t(
                    'tech.expenses.upload-receipt'
                  )}
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="
                    image/jpeg,
                    image/png,
                    image/webp,
                    application/pdf
                  "
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      flex
                      min-h-[120px]
                      w-full
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      border-2
                      border-dashed
                      border-border
                      bg-secondary/30
                      p-5
                      text-center
                      transition
                      hover:border-primary
                      hover:bg-secondary
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary
                    "
                  >
                    <Upload
                      className="
                        mb-3
                        h-7
                        w-7
                        text-muted-foreground
                      "
                    />

                    <span
                      className="
                        text-sm
                        font-medium
                        text-foreground
                      "
                    >
                      Ajouter un justificatif
                    </span>

                    <span
                      className="
                        mt-1
                        text-xs
                        text-muted-foreground
                      "
                    >
                      JPG, PNG, WEBP ou PDF
                      · 10 Mo maximum
                    </span>
                  </button>
                ) : (
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-border
                      bg-secondary/50
                      p-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary/10
                        text-primary
                      "
                    >
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          truncate
                          text-sm
                          font-medium
                          text-foreground
                        "
                      >
                        {selectedFile.name}
                      </p>

                      <p
                        className="
                          text-xs
                          text-muted-foreground
                        "
                      >
                        {(
                          selectedFile.size /
                          1024 /
                          1024
                        ).toFixed(2)}{' '}
                        Mo
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        removeSelectedFile
                      }
                      aria-label="Supprimer le justificatif"
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-muted-foreground
                        transition
                        hover:bg-destructive/10
                        hover:text-destructive
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-destructive
                      "
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  submitting ||
                  !formData.amount
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
                <Send
                  className="
                    h-4
                    w-4
                  "
                />

                {submitting
                  ? 'Envoi en cours...'
                  : t('common.submit')}
              </button>
            </form>
          </section>

          {/* =================================
              EXPENSE LIST
          ================================== */}

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
                  'tech.expenses.list'
                )}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Consultez l'historique de
                vos dépenses.
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
              expenses.length === 0 && (
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
                  <FileText
                    className="
                      mb-3
                      h-10
                      w-10
                      text-muted-foreground
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-medium
                      text-foreground
                    "
                  >
                    Aucune dépense
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Vos dépenses apparaîtront
                    ici après leur soumission.
                  </p>
                </div>
              )}

            {/* =================================
                MOBILE EXPENSE CARDS
            ================================== */}

            {!isLoading &&
              expenses.length > 0 && (
                <div
                  className="
                    space-y-3
                    lg:hidden
                  "
                >
                  {expenses.map(
                    (expense) => (
                      <div
                        key={expense.id}
                        className="
                          rounded-xl
                          border
                          border-border
                          bg-background
                          p-4
                          transition
                          hover:bg-secondary/30
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >
                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                font-medium
                                text-foreground
                              "
                            >
                              {expense.description ||
                                expense.category}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-muted-foreground
                              "
                            >
                              {expense.category}
                            </p>
                          </div>

                          <span
                            className={`
                              shrink-0
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusColor(
                                expense.status
                              )}
                            `}
                          >
                            {getStatusLabel(
                              expense.status
                            )}
                          </span>
                        </div>

                        <div
                          className="
                            mt-4
                            flex
                            items-end
                            justify-between
                            gap-4
                            border-t
                            border-border
                            pt-3
                          "
                        >
                          <div>
                            <p
                              className="
                                text-xs
                                text-muted-foreground
                              "
                            >
                              Date
                            </p>

                            <p
                              className="
                                mt-1
                                text-sm
                                text-foreground
                              "
                            >
                              {formatDate(
                                expense.createdAt
                              )}
                            </p>
                          </div>

                          <p
                            className="
                              text-base
                              font-bold
                              text-foreground
                            "
                          >
                            {formatCurrency(
                              expense.amount
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

            {/* =================================
                DESKTOP TABLE
            ================================== */}

            {!isLoading &&
              expenses.length > 0 && (
                <div
                  className="
                    hidden
                    overflow-x-auto
                    lg:block
                  "
                >
                  <table
                    className="
                      w-full
                      border-collapse
                    "
                  >
                    <thead>
                      <tr
                        className="
                          border-b
                          border-border
                        "
                      >
                        <th
                          className="
                            px-4
                            py-3
                            text-left
                            text-sm
                            font-semibold
                            text-foreground
                          "
                        >
                          Description
                        </th>

                        <th
                          className="
                            px-4
                            py-3
                            text-left
                            text-sm
                            font-semibold
                            text-foreground
                          "
                        >
                          {t(
                            'tech.expenses.amount'
                          )}
                        </th>

                        <th
                          className="
                            px-4
                            py-3
                            text-left
                            text-sm
                            font-semibold
                            text-foreground
                          "
                        >
                          {t(
                            'tech.expenses.date'
                          )}
                        </th>

                        <th
                          className="
                            px-4
                            py-3
                            text-left
                            text-sm
                            font-semibold
                            text-foreground
                          "
                        >
                          {t(
                            'tech.expenses.status'
                          )}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {expenses.map(
                        (expense) => (
                          <tr
                            key={expense.id}
                            className="
                              border-b
                              border-border
                              transition-colors
                              last:border-0
                              hover:bg-secondary/50
                            "
                          >
                            <td
                              className="
                                px-4
                                py-4
                              "
                            >
                              <div>
                                <p
                                  className="
                                    font-medium
                                    text-foreground
                                  "
                                >
                                  {expense.description ||
                                    expense.category}
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                  "
                                >
                                  {expense.category}
                                </p>
                              </div>
                            </td>

                            <td
                              className="
                                px-4
                                py-4
                                font-medium
                                text-foreground
                              "
                            >
                              {formatCurrency(
                                expense.amount
                              )}
                            </td>

                            <td
                              className="
                                whitespace-nowrap
                                px-4
                                py-4
                                text-sm
                                text-muted-foreground
                              "
                            >
                              {formatDate(
                                expense.createdAt
                              )}
                            </td>

                            <td
                              className="
                                px-4
                                py-4
                              "
                            >
                              <span
                                className={`
                                  inline-flex
                                  rounded-full
                                  border
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold
                                  ${getStatusColor(
                                    expense.status
                                  )}
                                `}
                              >
                                {getStatusLabel(
                                  expense.status
                                )}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
          </section>
        </div>
      </div>
    </main>
  )
}

