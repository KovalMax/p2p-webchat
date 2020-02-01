<?php

namespace App\Exception;

use App\DTO\Violation;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationListInterface;

class ConstraintValidationException extends \Exception
{
    private const DEFAULT_MESSAGE = 'Validation error';

    /**
     * @var Violation[]
     */
    private array $errors;

    /**
     * @param string     $message
     * @param int        $code
     * @param \Throwable $previous
     */
    public function __construct(string $message = self::DEFAULT_MESSAGE, int $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->errors = [];
    }

    /**
     * @param ConstraintViolationListInterface $violations
     * @param string                           $message
     *
     * @return ConstraintValidationException
     */
    public static function createFromViolationList(ConstraintViolationListInterface $violations, $message = self::DEFAULT_MESSAGE): self
    {
        return (new static($message))->mergeConstraintViolationList($violations);
    }

    /**
     * @return Violation[]
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * @param Violation ...$violations
     *
     * @return ConstraintValidationException
     */
    private function addErrors(Violation ...$violations): self
    {
        $this->errors = array_merge($this->errors, $violations);

        return $this;
    }

    /**
     * @param ConstraintViolationListInterface $violations
     *
     * @return ConstraintValidationException
     */
    private function mergeConstraintViolationList(ConstraintViolationListInterface $violations): ConstraintValidationException
    {
        /** @var ConstraintViolation $violation */
        foreach ($violations as $violation) {
            $this->addErrors((new Violation($violation->getPropertyPath() ?? '', (string) $violation->getMessage())));
        }

        return $this;
    }
}
