<?php

namespace App\Component\Http;

use App\DTO\Http\HttpError;
use App\DTO\Http\HttpErrorResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;

final class HttpErrorFormatter
{
    private const DEFAULT_TYPE   = 'about:blank';
    private const DEFAULT_TITLE  = 'Internal server error';
    private const DEFAULT_STATUS = Response::HTTP_INTERNAL_SERVER_ERROR;

    private const TYPE           = 'type';
    private const TITLE          = 'title';
    private const DETAIL         = 'detail';
    private const INVALID_PARAMS = 'invalid-params';
    private const STATUS         = 'status';


    /** @see https://tools.ietf.org/html/rfc7807 */
    private const ERROR_STRUCTURE = [
        self::TYPE,
        self::TITLE,
        self::DETAIL,
        self::STATUS,
        self::INVALID_PARAMS,
    ];

    private const DEFAULT_ERROR = [
        self::TYPE => self::DEFAULT_TYPE,
        self::TITLE => self::DEFAULT_TITLE,
        self::STATUS => self::DEFAULT_STATUS,
    ];

    /**
     * @var HttpErrorConfigProvider
     */
    private HttpErrorConfigProvider $configProvider;

    /**
     * @var PropertyAccessorInterface
     */
    private PropertyAccessorInterface $propertyAccessor;

    public function __construct(HttpErrorConfigProvider $configProvider, PropertyAccessorInterface $propertyAccessor)
    {
        $this->configProvider = $configProvider;
        $this->propertyAccessor = $propertyAccessor;
    }

    /**
     * @param \Throwable $exception
     *
     * @return HttpErrorResponse
     */
    public function formatError(\Throwable $exception): HttpErrorResponse
    {
        $responseCode = self::DEFAULT_STATUS;
        $error = self::DEFAULT_ERROR;
        $formatInstructions = $this->configProvider->getConfigForException((string) \get_class($exception));
        if (null !== $formatInstructions) {
            $responseCode = $formatInstructions->getResponseCode();
            foreach (self::ERROR_STRUCTURE as $attribute) {
                $extractedValue = $this->extractValue($attribute, $exception, $formatInstructions);
                if (!$extractedValue) {
                    continue;
                }

                $error[$attribute] = $extractedValue;
            }
        }

        return new HttpErrorResponse($responseCode, $error);
    }

    /**
     * @param string     $attribute
     * @param \Throwable $exception
     * @param HttpError  $formatInstruction
     *
     * @return string|int|object[]
     */
    private function extractValue(string $attribute, \Throwable $exception, HttpError $formatInstruction)
    {
        $exploded = explode('-', $attribute);
        if ($exploded && count($exploded) > 1) {
            foreach ($exploded as $index => &$word) {
                if ($index == 0) {
                    continue;
                }
                $word = ucfirst($word);
            }
            $attribute = implode('', $exploded);
        }

        $staticParameter = $this->propertyAccessor->getValue($formatInstruction->getStaticParams(), $attribute);
        $classGetterName = $this->propertyAccessor->getValue($formatInstruction->getClassParams(), $attribute);
        if (null !== $classGetterName) {
            $classParameter = $this->propertyAccessor->getValue($exception, $classGetterName);
        }

        return $classParameter ?? $staticParameter;
    }
}
